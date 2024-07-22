import { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { useDelegationFormSubmit } from 'modules/delegation/hooks/useDelegationFormSubmit'
import { useDelegationFormData } from 'modules/delegation/providers/DelegationFormContext'
import { DelegationFormControllerStyled } from './DelegationFormStyle'

export const DelegationFormController: FC = ({ children }) => {
  const { handleSubmit } = useFormContext()
  const { mode } = useDelegationFormData()
  const { submitDelegation } = useDelegationFormSubmit({ mode })

  return (
    <DelegationFormControllerStyled
      $customMode={mode !== 'simple'}
      autoComplete="off"
      onSubmit={handleSubmit(submitDelegation)}
      children={children}
    />
  )
}
