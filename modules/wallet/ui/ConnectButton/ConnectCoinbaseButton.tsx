import { useCallback } from 'react'
import { useConnectorCoinbase } from '@lido-sdk/web3-react'
import { Coinbase } from '@lidofinance/icons'
import { ConnectButton } from './ConnectButton'
import type { ConnectWalletButtonProps } from './types'

export function ConnectCoinbaseButton(props: ConnectWalletButtonProps) {
  const { onConnect, ...rest } = props
  const { connect } = useConnectorCoinbase()

  const handleConnect = useCallback(async () => {
    onConnect?.()
    await connect()
  }, [onConnect, connect])

  return (
    <ConnectButton
      {...rest}
      icon={<Coinbase />}
      onClick={handleConnect}
      children="Coinbase Wallet"
    />
  )
}
