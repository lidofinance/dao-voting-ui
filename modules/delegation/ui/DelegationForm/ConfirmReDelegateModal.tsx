import { Button, Modal, ModalProps, Warning } from '@lidofinance/lido-ui'
import { getUseModal } from 'modules/modal/useModal'
import { ModalButtonGroup } from './DelegationStatus/DelegationStatusStyle'

function ConfirmReDelegateModal(props: ModalProps) {
  const handleRedelegate = () => {
    props.data.onSubmit?.()
    props.onClose?.()
  }
  const handleCustomize = () => {
    props.data.onAlternative?.()
    props.onClose?.()
  }

  return (
    <Modal
      title="Notce"
      subtitle={props.data?.subtitle ?? ''}
      titleIcon={<Warning />}
      center
      {...props}
    >
      <ModalButtonGroup>
        <Button onClick={handleRedelegate}>Redelegate</Button>
        <Button variant="outlined" onClick={handleCustomize}>
          Customize
        </Button>
      </ModalButtonGroup>
    </Modal>
  )
}

export const useConfirmReDelegateModal = getUseModal(ConfirmReDelegateModal)
