import { Button, Modal, ModalProps } from '@lidofinance/lido-ui'
import { getUseModal } from 'modules/modal/useModal'
import { ModalButtonGroup } from './DelegationStatusStyle'

function ConfirmRevokeModal(props: ModalProps) {
  const handleRevoke = () => {
    props.data.onRevoke?.()
    props.onClose?.()
  }

  return (
    <Modal title={props.data?.title || 'Revoke delegation?'} center {...props}>
      <ModalButtonGroup>
        <Button onClick={handleRevoke}>Revoke</Button>
        <Button variant="outlined" onClick={props.onClose}>
          Cancel
        </Button>
      </ModalButtonGroup>
    </Modal>
  )
}

export const useConfirmRevokeModal = getUseModal(ConfirmRevokeModal)
