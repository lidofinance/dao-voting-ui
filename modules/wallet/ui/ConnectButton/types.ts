import type { ButtonProps } from '@lidofinance/lido-ui'

export type ConnectWalletButtonProps = ButtonProps & {
  onConnect?: () => void
}
