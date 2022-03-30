import { useCallback } from 'react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { openWindow } from 'modules/shared/utils/openWindow'
import { getGnosisSafeLink } from '../utils/getGnosisSafeLink'

export function useGnosisOpener(address: string, linkAddition?: string) {
  const { chainId } = useWeb3()
  return useCallback(() => {
    const link = getGnosisSafeLink(chainId, `${address}${linkAddition || ''}`)
    openWindow(link)
  }, [chainId, address, linkAddition])
}
