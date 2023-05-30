import { FC, useMemo } from 'react'
import { WagmiConfig, configureChains, createClient } from 'wagmi'
import * as wagmiChains from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { getConnectors } from 'reef-knot/core-react'
import getConfig from 'next/config'
import { useConfig } from 'modules/config/hooks/useConfig'

const { publicRuntimeConfig } = getConfig()

export const AppWagmiConfig: FC = ({ children }) => {
  const { supportedChainIds, getRpcUrl } = useConfig()
  const supportedChains = Object.values(wagmiChains).filter(chain =>
    supportedChainIds.includes(chain.id),
  )

  const backendRPC = useMemo(
    () =>
      supportedChainIds.reduce<Record<number, string>>(
        (res, curr) => ({ ...res, [curr]: getRpcUrl(curr) }),
        {},
      ),
    [supportedChainIds, getRpcUrl],
  )

  const connectors = getConnectors({
    rpc: backendRPC,
    walletconnectProjectId: publicRuntimeConfig.walletconnectProjectId,
  })

  const { provider, webSocketProvider } = configureChains(supportedChains, [
    jsonRpcProvider({
      rpc: chain => ({
        http: backendRPC[chain.id],
      }),
    }),
  ])

  const client = createClient({
    connectors,
    autoConnect: true,
    provider,
    webSocketProvider,
  })

  return <WagmiConfig client={client}>{children}</WagmiConfig>
}
