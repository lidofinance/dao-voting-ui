import { useCallback } from 'react'
import { useConnectorLedger } from '@lido-sdk/web3-react'
import { LedgerCircle } from '@lidofinance/icons'
import { ConnectButton } from './ConnectButton'
import { ConnectWalletButtonProps } from './types'

export function ConnectLedgerButton(props: ConnectWalletButtonProps) {
  const { onConnect, disabled, ...rest } = props
  const { connect } = useConnectorLedger()

  const handleConnect = useCallback(async () => {
    onConnect?.()
    await connect?.()
  }, [onConnect, connect])

  return (
    <ConnectButton
      {...rest}
      disabled={disabled || !connect}
      icon={<LedgerCircle />}
      onClick={handleConnect}
      children="Ledger"
    />
  )
}
