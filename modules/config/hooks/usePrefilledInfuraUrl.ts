import { useMemo } from 'react'
import { useConfig } from 'modules/config/hooks/useConfig'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import { getRPCUrls } from '@lido-sdk/fetch'

export function usePrefilledInfuraUrl() {
  const { chainId } = useWeb3()
  const { settingsPrefillInfura } = useConfig()

  return useMemo(() => {
    return getRPCUrls(chainId, { infura: settingsPrefillInfura })[0]
  }, [chainId, settingsPrefillInfura])
}
