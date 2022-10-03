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
          size="xs"
          onClick={openConnectWalletModal}
          children="Connect"
          style={{ width: '100%' }}
        />
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
