import { useCallback } from 'react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { openWindow } from 'modules/shared/utils/openWindow'
import { getEtherscanLink, EtherscanEntity } from '../utils/etherscan'

export function useEtherscanOpener(value: string, entity: EtherscanEntity) {
  const { chainId } = useWeb3()
  return useCallback(() => {
    const link = getEtherscanLink(chainId, value, entity)
    openWindow(link)
  }, [chainId, entity, value])
}
