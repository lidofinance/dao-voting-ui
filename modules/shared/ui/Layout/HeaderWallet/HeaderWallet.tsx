import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useWalletModal } from 'modules/wallet/ui/WalletModal'
import { useConnectWalletModal } from 'modules/wallet/ui/ConnectWalletModal'

import { Button } from '@lidofinance/lido-ui'
import { Wrap, AddressBadge } from './HeaderWalletStyle'

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
          children="Connect"
          style={{ width: '100%' }}
        />
      </Wrap>
    )
  }

  return (
    <Wrap>
      <AddressBadge
        symbols={3}
        address={walletAddress!}
        onClick={openWalletModal}
      />
    </Wrap>
  )
}
