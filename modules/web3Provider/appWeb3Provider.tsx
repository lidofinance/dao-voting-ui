import { CHAINS } from '@lido-sdk/constants'
import { useConfig } from 'modules/config/hooks/useConfig'
import getConfig from 'next/config'
import { useMemo } from 'react'
import { ProviderWeb3 } from 'reef-knot/web3-react'

const { publicRuntimeConfig } = getConfig()

export function AppProviderWeb3({ children }: { children: React.ReactNode }) {
  const { supportedChainIds, defaultChain, getRpcUrl } = useConfig()

  const backendRPC = useMemo(
    () =>
      supportedChainIds.reduce<Record<number, string>>(
        (res, curr) => ({ ...res, [curr]: getRpcUrl(curr) }),
        {
          // Required by reef-knot
          [CHAINS.Mainnet]: getRpcUrl(CHAINS.Mainnet),
        },
      ),
    [supportedChainIds, getRpcUrl],
  )

  return (
    <ProviderWeb3
      defaultChainId={defaultChain}
      supportedChainIds={supportedChainIds}
      rpc={backendRPC}
      walletconnectProjectId={publicRuntimeConfig.walletconnectProjectId}
      children={children}
    />
  )
}
