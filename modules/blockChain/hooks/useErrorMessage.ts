import { useMemo } from 'react'
import { useConfig } from 'modules/config/hooks/useConfig'
import { useSupportedChains, useWeb3 } from '@reef-knot/web3-react'

import { getChainName } from 'modules/blockChain/chains'

export function useErrorMessage() {
  const { error } = useWeb3()
  const { isUnsupported } = useSupportedChains()
  const { supportedChainIds } = useConfig()

  const chains = useMemo(() => {
    const networksList = supportedChainIds.map(chainId => getChainName(chainId))
    return networksList.join(' / ')
  }, [supportedChainIds])

  if (isUnsupported) {
    return `Unsupported chain. You will not be able to make a vote. Please switch to ${chains} in your wallet.`
  }

  return error?.message
}
