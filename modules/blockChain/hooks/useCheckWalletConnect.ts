import { useCallback } from 'react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useConnectWalletModal } from 'modules/wallet/ui/ConnectWalletModal'

export function useCheckWalletConnect() {
  const { isWalletConnected } = useWeb3()
  const connectWalletModal = useConnectWalletModal()
  const checkWalletConnect = useCallback(() => {
    if (!isWalletConnected) {
      connectWalletModal.openModal()
      return false
    }
    return true
  }, [isWalletConnected, connectWalletModal])
  return checkWalletConnect
}
