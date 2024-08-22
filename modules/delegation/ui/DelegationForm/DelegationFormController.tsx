import { FC } from 'react'
import { useDelegationFormData } from 'modules/delegation/providers/DelegationFormContext'
import { DelegationFormControllerStyled } from './DelegationFormStyle'

export const DelegationFormController: FC = ({ children }) => {
  const { mode, onSubmit } = useDelegationFormData()

  return (
    <DelegationFormControllerStyled
      $customMode={mode !== 'simple'}
      onSubmit={onSubmit}
      children={children}
    />
  )
}
