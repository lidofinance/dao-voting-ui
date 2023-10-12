import { useThemeToggle } from '@lidofinance/lido-ui'
import { WalletsModalForEth } from 'reef-knot/connect-wallet-modal'

type WalletModalForEthProps = React.ComponentProps<typeof WalletsModalForEth>

const HIDDEN_WALLETS: WalletModalForEthProps['hiddenWallets'] = [
  'Opera Wallet',
  'Coinbase',
  'Trust',
  'ImToken',
  'Coin98',
  'MathWallet',
  'Brave Wallet',
  'Gamestop',
  'Xdefi',
  'ambire',
  'blockchaincom',
  'exodus',
  'okx',
  'phantom',
  'tally',
  'zengo',
  'zerion',
  'bitget',
  'bitkeep',
  'taho',
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
