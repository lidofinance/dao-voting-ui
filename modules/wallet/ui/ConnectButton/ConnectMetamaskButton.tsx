import { useCallback } from 'react'
import { useConnectorMetamask } from '@lido-sdk/web3-react'
import { MetaMaskCircle } from '@lidofinance/icons'
import { ConnectButton } from './ConnectButton'
import { ConnectWalletButtonProps } from './types'

export function ConnectMetamaskButton(props: ConnectWalletButtonProps) {
  const { onConnect, ...rest } = props
  const { connect } = useConnectorMetamask()

  const handleConnect = useCallback(async () => {
    onConnect?.()
    await connect()
  }, [onConnect, connect])

  return (
    <ConnectButton
      {...rest}
      icon={<MetaMaskCircle />}
      onClick={handleConnect}
      children="Metamask"
    />
  )
}
