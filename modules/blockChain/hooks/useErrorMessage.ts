import { useMemo } from 'react'
import { useConfig } from 'modules/config/hooks/useConfig'
import { useConnect } from 'wagmi'
import { getChainName } from 'modules/blockChain/chains'
import { useIsChainSupported } from './useIsChainSupported'

export function useErrorMessage() {
  const { error } = useConnect()
  const isChainSupported = useIsChainSupported()
  const { supportedChainIds } = useConfig()

  const chains = useMemo(() => {
    const networksList = supportedChainIds.map(chainId => getChainName(chainId))
    return networksList.join(' / ')
  }, [supportedChainIds])

  if (!isChainSupported) {
    return `Unsupported chain. You will not be able to make a vote. Please switch to ${chains} in your wallet.`
  }

  return error?.message
}
