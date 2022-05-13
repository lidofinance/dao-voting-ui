import { useConnectWalletModal } from 'modules/wallet/ui/ConnectWalletModal'

import { Text } from '@lidofinance/lido-ui'
import { Connect } from './VoteFormMustConnectStyle'

export function VoteFormMustConnect() {
  const openConnectWalletModal = useConnectWalletModal()

  return (
    <Text size="sm" color="secondary" style={{ textAlign: 'center' }}>
      You must{' '}
      <Connect onClick={openConnectWalletModal}>connect your wallet</Connect>{' '}
      and have governance token to vote on this proposal
    </Text>
  )
}
