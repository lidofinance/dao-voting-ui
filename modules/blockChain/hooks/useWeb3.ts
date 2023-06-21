import { useMemo } from 'react'
import { useProvider } from 'wagmi'
import { useWeb3 as useWeb3ReefKnot } from 'reef-knot/web3-react'
import { useConfig } from 'modules/config/hooks/useConfig'
import { parseChainId } from '../chains'

export function useWeb3() {
  const web3 = useWeb3ReefKnot()
  const { defaultChain } = useConfig()
  const { chainId } = web3

  const currentChain = useMemo(
    () => parseChainId(chainId || defaultChain),
    [chainId, defaultChain],
  )

  const wagmiProvider = useProvider()
  const library = web3.library || wagmiProvider

  return {
    ...web3,
    isWalletConnected: web3.active,
    walletAddress: web3.account,
    chainId: currentChain,
    library,
  }
}
