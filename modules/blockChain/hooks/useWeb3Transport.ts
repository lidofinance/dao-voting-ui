import { useMemo, useCallback } from 'react'
import {
  type Transport,
  fallback,
  createTransport,
  http,
  EIP1193Provider,
  custom,
  Chain,
  UnsupportedProviderMethodError,
  InvalidParamsRpcError,
} from 'viem'
import type { OnResponseFn } from 'viem/_types/clients/transports/fallback'
import type { Connection } from 'wagmi'

// We disable those methods so wagmi uses getLogs instead to watch events
// Filters are not suitable for public rpc and break between fallbacks
const DISABLED_METHODS = new Set([
  'eth_newFilter',
  'eth_getFilterChanges',
  'eth_uninstallFilter',
])

export const PROVIDER_BATCH_TIME = 150
export const PROVIDER_MAX_BATCH = 20

// eslint-disable-next-line @typescript-eslint/no-empty-function
const NOOP = () => {}

// Viem transport wrapper that allows runtime changes via setter
const runtimeMutableTransport = (
  mainTransports: Transport[],
): [Transport, (t: Transport | null) => void] => {
  let withInjectedTransport: Transport | null = null
  return [
    params => {
      const defaultTransport = fallback(mainTransports)(params)
      let responseFn: OnResponseFn = NOOP
      return createTransport(
        {
          key: 'RuntimeMutableTransport',
          name: 'RuntimeMutableTransport',
          //@ts-expect-error invalid typings
          async request(requestParams, options) {
            const transport = withInjectedTransport
              ? withInjectedTransport(params)
              : defaultTransport

            if (DISABLED_METHODS.has(requestParams.method)) {
              const error = new UnsupportedProviderMethodError(
                new Error(`Method ${requestParams.method} is not supported`),
              )
              responseFn({
                error,
                method: requestParams.method,
                params: params as unknown[],
                transport,
                status: 'error',
              })
              throw error
            }

            if (
              requestParams.method === 'eth_getLogs' &&
              Array.isArray(requestParams.params) &&
              // works for empty array, empty string and all falsish values
              !requestParams.params[0]?.address?.length
            ) {
              console.warn(
                '[runtimeMutableTransport] Invalid empty getLogs',
                requestParams,
              )
              const error = new InvalidParamsRpcError(
                new Error(`Empty address for eth_getLogs is not supported`),
              )
              responseFn({
                error,
                method: requestParams.method,
                params: params as unknown[],
                transport,
                status: 'error',
              })
              throw error
            }

            transport.value?.onResponse(responseFn)
            if (
              ['eth_call', 'eth_estimateGas'].includes(requestParams.method)
            ) {
              try {
                return await transport.request(requestParams, options)
              } catch (error: any) {
                if (
                  error?.message?.includes('execution reverted') ||
                  error?.code === 3
                ) {
                  return null
                }
                throw error
              }
            }

            try {
              return await transport.request(requestParams, options)
            } catch (error: any) {
              if (
                error?.message?.includes('execution reverted') ||
                error?.code === 3
              ) {
                return null
              }

              throw error
            }
          },
          type: 'fallback',
        },
        {
          transports: defaultTransport.value?.transports,
          onResponse: (fn: OnResponseFn) => (responseFn = fn),
        },
      )
    },
    (injectedTransport: Transport | null) => {
      if (injectedTransport) {
        withInjectedTransport = fallback([injectedTransport, ...mainTransports])
      } else {
        withInjectedTransport = null
      }
    },
  ]
}

// returns Viem transport map that uses browser wallet RPC provider when avaliable fallbacked by our RPC
export const useWeb3Transport = (
  supportedChains: Chain[],
  backendRpcMap: Record<number, string>,
) => {
  const { transportMap, setTransportMap } = useMemo(() => {
    return supportedChains.reduce(
      // eslint-disable-next-line @typescript-eslint/no-shadow
      ({ transportMap, setTransportMap }, chain) => {
        const [transport, setTransport] = runtimeMutableTransport([
          http(backendRpcMap[chain.id], {
            batch: {
              wait: PROVIDER_BATCH_TIME,
              batchSize: PROVIDER_MAX_BATCH,
            },
            name: backendRpcMap[chain.id],
            retryCount: 0,
            timeout: 10000,
          }),
          http(undefined, {
            batch: {
              wait: PROVIDER_BATCH_TIME,
              batchSize: PROVIDER_MAX_BATCH,
            },
            name: 'default HTTP RPC',
            retryCount: 0,
            timeout: 10000,
          }),
        ])
        return {
          transportMap: {
            ...transportMap,
            [chain.id]: transport,
          },
          setTransportMap: {
            ...setTransportMap,
            [chain.id]: setTransport,
          },
        }
      },
      {
        transportMap: {} as Record<number, Transport>,
        setTransportMap: {} as Record<number, (t: Transport | null) => void>,
      },
    )
  }, [supportedChains, backendRpcMap])

  const onActiveConnection = useCallback(
    async (activeConnection: Connection | null) => {
      for (const chain of supportedChains) {
        const setTransport = setTransportMap[chain.id]
        if (
          activeConnection &&
          chain.id === activeConnection.chainId &&
          activeConnection.connector.type === 'injected'
        ) {
          const provider = (await activeConnection.connector.getProvider({
            chainId: chain.id,
          })) as EIP1193Provider | undefined

          setTransport(provider ? custom(provider) : null)
        } else setTransport(null)
      }
    },
    [setTransportMap, supportedChains],
  )

  return { transportMap, onActiveConnection }
}
