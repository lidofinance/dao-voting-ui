import { Button, Modal, Warning } from '@lidofinance/lido-ui'
import { getUseModal } from 'modules/modal/useModal'
import { ModalButtonGroup } from './DelegationStatus/DelegationStatusStyle'
import { ModalProps } from 'modules/modal/ModalProvider'

function ConfirmReDelegateModal(
  props: ModalProps<{
    onSubmit?: () => void
    onAlternative?: () => void
    subtitle?: React.ReactNode
  }>,
) {
  const handleRedelegate = () => {
    props.onSubmit?.()
    props.onClose?.()
  }
  const handleCustomize = () => {
    props.onAlternative?.()
    props.onClose?.()
  }

  return (
    <Modal
      title="Notice"
      subtitle={props.subtitle ?? 'You are about to redelegate'}
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
