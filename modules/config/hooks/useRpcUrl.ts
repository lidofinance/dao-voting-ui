import { useCallback } from 'react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useConfig } from './useConfig'
import { usePrefilledInfuraUrl } from './usePrefilledInfuraUrl'

import { CHAINS } from '@lido-sdk/constants'
import { getRpcUrlDefault } from '../network'

export function useGetRpcUrl() {
  const { savedConfig } = useConfig()
  const settingsPrefilledInfura = usePrefilledInfuraUrl()
  return useCallback(
    (chainId: CHAINS) => {
      return (
        savedConfig.rpcUrls[chainId] ||
        settingsPrefilledInfura ||
        getRpcUrlDefault(chainId)
      )
    },
    [savedConfig.rpcUrls, settingsPrefilledInfura],
  )
}

export function useRpcUrl() {
  const { chainId } = useWeb3()
  const getRpcUrl = useGetRpcUrl()
  return getRpcUrl(chainId)
}
