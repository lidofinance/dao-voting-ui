import { useMemo } from 'react'
import { useConfig } from 'modules/config/hooks/useConfig'
import { useSupportedChains } from 'reef-knot/web3-react'
import { useConnect } from 'wagmi'
import { getChainName } from 'modules/blockChain/chains'
import { useWeb3 } from './useWeb3'

export function useErrorMessage() {
  const { error } = useConnect()
  const { isWalletConnected } = useWeb3()
  const { isUnsupported } = useSupportedChains()
  const { supportedChainIds } = useConfig()

  const chains = useMemo(() => {
    const networksList = supportedChainIds.map(chainId => getChainName(chainId))
    return networksList.join(' / ')
  }, [supportedChainIds])

  if (!isWalletConnected) {
    return null
  }

  if (isUnsupported) {
    return `Unsupported chain. You will not be able to make a vote. Please switch to ${chains} in your wallet.`
  }

  return error?.message
}
