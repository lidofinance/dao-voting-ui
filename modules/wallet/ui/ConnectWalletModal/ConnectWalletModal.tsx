import { useThemeToggle } from '@lidofinance/lido-ui'

import { WalletsModalForEth } from '@reef-knot/connect-wallet-modal'

type WalletModalForEthProps = React.ComponentProps<typeof WalletsModalForEth>

const HIDDEN_WALLETS: WalletModalForEthProps['hiddenWallets'] = [
  'Coinbase',
  'Trust',
  'ImToken',
  'Coin98',
  'MathWallet',
  'Tally',
  'Ambire',
  'Blockchain.com Wallet',
  'ZenGo',
  'Brave Wallet',
  'Opera Wallet',
  'Exodus',
  'Gamestop',
  'Xdefi',
  'Zerion',
]

type Props = WalletModalForEthProps & {}

export function ConnectWalletModal(props: Props) {
  const { themeName } = useThemeToggle()

  return (
    <WalletsModalForEth
      {...props}
      buttonsFullWidth
      hiddenWallets={HIDDEN_WALLETS}
      shouldInvertWalletIcon={themeName === 'dark'}
    />
  )
}
