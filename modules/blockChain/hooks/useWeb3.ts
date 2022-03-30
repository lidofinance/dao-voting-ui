import { useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useConfig } from 'modules/config/hooks/useConfig'
import { parseChainId } from '../chains'

export function useWeb3() {
  const web3 = useWeb3React()
  const { defaultChain } = useConfig()
  const { chainId } = web3

  const currentChain = useMemo(
    () => parseChainId(chainId || defaultChain),
    [chainId, defaultChain],
  )

  return {
    ...web3,
    isWalletConnected: web3.active,
    walletAddress: web3.account,
    chainId: currentChain,
  }
}
