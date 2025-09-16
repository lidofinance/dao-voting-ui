import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useConfig } from 'modules/config/hooks/useConfig'

export const useIsChainSupported = () => {
  const { chainId: accountChainId } = useAccount()
  const { supportedChainIds } = useConfig()

  return useMemo(() => {
    return accountChainId ? supportedChainIds.includes(accountChainId) : true
  }, [supportedChainIds, accountChainId])
}
