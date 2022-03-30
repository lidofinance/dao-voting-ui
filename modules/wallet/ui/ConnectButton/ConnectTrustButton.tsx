import { useCallback } from 'react'
import { useConnectorTrust } from '@lido-sdk/web3-react'
import { ConnectButton } from './ConnectButton'
import { ConnectWalletButtonProps } from './types'
import { TrustCircle } from '@lidofinance/icons'

export function ConnectTrustButton(props: ConnectWalletButtonProps) {
  const { onConnect, ...rest } = props
  const { connect } = useConnectorTrust()

  const handleConnect = useCallback(async () => {
    onConnect?.()
    await connect?.()
  }, [onConnect, connect])

  return (
    <ConnectButton
      {...rest}
      icon={<TrustCircle />}
      onClick={handleConnect}
      children="Trust"
    />
  )
}
