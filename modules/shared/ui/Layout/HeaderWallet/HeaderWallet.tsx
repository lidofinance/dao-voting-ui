import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useWalletModal } from 'modules/wallet/ui/WalletModal'
import { useConnectWalletModal } from 'modules/wallet/ui/ConnectWalletModal'

import { Button, Identicon, trimAddress } from '@lidofinance/lido-ui'
import { Wrap, AddressBadge, AddressText } from './HeaderWalletStyle'

type Props = {
  trimAddressSymbols?: number
}

export function HeaderWallet({ trimAddressSymbols = 3 }: Props) {
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
          data-testid="connectButton"
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
        <AddressText data-testid="accountSection">
          {trimAddress(walletAddress!, trimAddressSymbols)}
        </AddressText>
      </AddressBadge>
    </Wrap>
  )
}
