import { useCallback } from 'react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useConnectWalletModal } from 'modules/wallet/ui/ConnectWalletModal'

export function useCheckWalletConnect() {
  const { isWalletConnected } = useWeb3()
  const openConnectWalletModal = useConnectWalletModal()
  const checkWalletConnect = useCallback(() => {
    if (!isWalletConnected) {
      openConnectWalletModal()
      return false
    }
    return true
  }, [isWalletConnected, openConnectWalletModal])
  return checkWalletConnect
}
