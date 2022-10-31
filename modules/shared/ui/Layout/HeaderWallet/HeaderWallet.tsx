import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useWalletModal } from 'modules/wallet/ui/WalletModal'
import { useConnectWalletModal } from 'modules/wallet/ui/ConnectWalletModal'

import { Button, Identicon, trimAddress } from '@lidofinance/lido-ui'
import { Wrap, AddressBadge, AddressText } from './HeaderWalletStyle'

export function HeaderWallet() {
  const { isWalletConnected, walletAddress } = useWeb3()
  const openWalletModal = useWalletModal()
  const openConnectWalletModal = useConnectWalletModal()

  if (!isWalletConnected) {
    return (
      <Wrap>
        <Button
          size="sm"
          onClick={openConnectWalletModal}
          style={{ width: '100%' }}
        >
          Connect wallet
        </Button>
      </Wrap>
    )
  }

  return (
    <Wrap>
      <AddressBadge onClick={openWalletModal}>
        <Identicon address={walletAddress!} />
        <AddressText>{trimAddress(walletAddress!, 3)}</AddressText>
      </AddressBadge>
    </Wrap>
  )
}
