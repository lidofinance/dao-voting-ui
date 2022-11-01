import { useConnectWalletModal } from 'modules/wallet/ui/ConnectWalletModal'

import { Button } from '@lidofinance/lido-ui'

export function VoteFormMustConnect() {
  const openConnectWalletModal = useConnectWalletModal()

  return (
    <Button fullwidth onClick={openConnectWalletModal}>
      Connect wallet
    </Button>
  )
}
