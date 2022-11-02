import { useCallback } from 'react'
import { useLocalStorage } from '@lido-sdk/react'
import { Modal, ModalProps } from '@lidofinance/lido-ui'
import { ConnectWalletModalTerms } from './ConnectWalletModalTerms'
import {
  ConnectMetamaskButton,
  ConnectWalletConnectButton,
  ConnectLedgerButton,
  // ConnectCoinbaseButton,
  // ConnectTrustButton,
  // ConnectImTokenButton,
} from '../ConnectButton'
import { STORAGE_TERMS_KEY } from 'modules/config'

type Props = ModalProps & {}

export function ConnectWalletModal(props: Props) {
  const { onClose } = props
  const [checked, setChecked] = useLocalStorage(STORAGE_TERMS_KEY, false)

  const handleChange = useCallback(() => {
    setChecked(currentValue => !currentValue)
  }, [setChecked])

  const common = {
    disabled: !checked,
    onConnect: onClose,
  }

  return (
    <Modal {...props} title="Connect wallet">
      <ConnectWalletModalTerms onChange={handleChange} checked={checked} />
      <ConnectMetamaskButton {...common} />
      <ConnectWalletConnectButton {...common} />
      <ConnectLedgerButton {...common} />
      {/* <ConnectCoinbaseButton {...common} /> */}
      {/* <ConnectTrustButton {...common} /> */}
      {/* <ConnectImTokenButton {...common} /> */}
    </Modal>
  )
}
