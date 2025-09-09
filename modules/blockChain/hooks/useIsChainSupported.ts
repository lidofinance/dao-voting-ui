import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useConfig } from 'modules/config/hooks/useConfig'

export const useIsChainSupported = () => {
  const { chainId: walletChain } = useAccount()
  const { supportedChainIds } = useConfig()

  return useMemo(() => {
    return walletChain ? supportedChainIds.includes(walletChain) : true
  }, [supportedChainIds, walletChain])
}
