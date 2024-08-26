import { useDelegationFormData } from 'modules/delegation/providers/DelegationFormContext'
import { DelegationFormFootNoteStyled } from './DelegationFormStyle'

export function DelegationFormFootNote() {
  const { mode } = useDelegationFormData()

  if (mode === 'simple') {
    return null
  }

  return (
    <DelegationFormFootNoteStyled>
      You only delegate your voting power, not the ownership of your tokens
    </DelegationFormFootNoteStyled>
  )
}
