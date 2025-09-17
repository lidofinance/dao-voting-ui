import { CHAINS } from 'modules/blockChain/chains'
import { useSWR } from 'modules/network/hooks/useSwr'
import { getStaticRpcBatchProvider } from 'modules/blockChain/utils/rpcProviders'
import { useConfig } from '../../config/hooks/useConfig'

const IGNORE_GAIANETWORK_PATTERN = /https?:\/\/api\.gaianet\.ai(?=[:/?#]|$)/i

export function useEnsNames(addresses: string[]) {
  const { getRpcUrl } = useConfig()

  const { data: ensNameList, initialLoading } = useSWR(
    [...addresses],
    async () => {
      const rpcUrl = getRpcUrl(CHAINS.Mainnet)
      const provider = getStaticRpcBatchProvider(CHAINS.Mainnet, rpcUrl)

      const result: Record<string, string | null> = {}
      await Promise.all(
        addresses.map(address =>
          provider
            .lookupAddress(address)
            .then(ens => {
              result[address] = ens
            })
            .catch(error => {
              const _error = error as Error

              // TODO: add GNS support
              if (IGNORE_GAIANETWORK_PATTERN.test(_error.message)) {
                console.log(
                  'Ignoring CSP error for api.gaianet.ai -> request api.gaianet.ai blocked by CSP, GNS not supported',
                )
                return null
              }
              throw error
            }),
        ),
      )

      return result
    },
  )
  return {
    data: ensNameList,
    initialLoading,
  }
}
