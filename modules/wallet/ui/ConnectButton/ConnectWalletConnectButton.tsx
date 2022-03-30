import { useCallback } from 'react'
import { useConnectorWalletConnect } from '@lido-sdk/web3-react'
import { WalletConnectCircle } from '@lidofinance/icons'
import { ConnectButton } from './ConnectButton'
import { ConnectWalletButtonProps } from './types'

export function ConnectWalletConnectButton(props: ConnectWalletButtonProps) {
  const { onConnect, ...rest } = props
  const { connect } = useConnectorWalletConnect()

  const handleConnect = useCallback(async () => {
    onConnect?.()
    await connect()
  }, [onConnect, connect])

  return (
    <ConnectButton
      {...rest}
      icon={<WalletConnectCircle />}
      onClick={handleConnect}
      children="WalletConnect"
    />
  )
}
