import { useMemo } from 'react'
import { useWeb3 as useWeb3ReefKnot } from 'reef-knot/web3-react'
import { useConfig } from 'modules/config/hooks/useConfig'
import { parseChainId } from '../chains'
import { useSDK } from '@lido-sdk/react'

export function useWeb3() {
  const web3 = useWeb3ReefKnot()
  const { providerWeb3 } = useSDK()
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
    library: providerWeb3,
  }
}
