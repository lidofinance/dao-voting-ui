import { VoteButtonStyled } from './VoteFormActionsStyle'
import { VoteMode } from '../../types'
import { forwardRef } from 'react'

interface Props {
  voteType: VoteMode
  isSubmitting: false | VoteMode
  openModal: () => void
  label: string
  icon: React.ReactNode
  disabledCondition: boolean
}

export const VoteButton = forwardRef<HTMLButtonElement, Props>(
  (
    { voteType, isSubmitting, openModal, label, icon, disabledCondition },
    ref,
  ) => {
    return (
      <VoteButtonStyled
        data-testid={`voteButton${label}`}
        ref={ref}
        loading={isSubmitting === voteType}
        color="secondary"
        disabled={disabledCondition}
        onClick={openModal}
      >
        {icon} {label}
      </VoteButtonStyled>
    )
  },
)

VoteButton.displayName = 'VoteButton'
