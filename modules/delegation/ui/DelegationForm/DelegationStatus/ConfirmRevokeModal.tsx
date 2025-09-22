import { Button, Modal } from '@lidofinance/lido-ui'
import { getUseModal } from 'modules/modal/useModal'
import { ModalButtonGroup } from './DelegationStatusStyle'
import { ModalProps } from 'modules/modal/ModalProvider'

function getTitleCase(str: string) {
  return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase())
}

function ConfirmRevokeModal(
  props: ModalProps<{ onRevoke: () => void; title?: string }>,
) {
  const handleRevoke = () => {
    props.onRevoke()
    props.onClose?.()
  }
  const title = getTitleCase(props.title ?? 'Revoke delegation?')

  return (
    <Modal title={title} center {...props}>
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
