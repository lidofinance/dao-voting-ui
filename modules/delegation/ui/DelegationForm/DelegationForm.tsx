import { DelegationFormProvider } from 'modules/delegation/providers/DelegationFormContext'
import { DelegationFormMode } from 'modules/delegation/types'
import { DelegationStatus } from './DelegationStatus/DelegationStatus'
import { DelegationFormSubtitle } from './DelegationFormSubtitle'
import { DelegationAddressInput } from './DelegationAddressInput'
import { DelegationFormBalance } from './DelegationFormBalance'
import { DelegationFormSubmitButton } from './DelegationFormSubmitButton'
import { DelegationFormFootNote } from './DelegationFormFootNote'
import { DelegationFormController } from './DelegationFormController'

type Props = {
  mode: DelegationFormMode
  onCustomizeClick?: () => void
}

export function DelegationForm({ mode, onCustomizeClick }: Props) {
  return (
    <DelegationFormProvider mode={mode}>
      <DelegationFormController>
        <DelegationFormSubtitle />
        <DelegationStatus />
        <DelegationAddressInput />
        <DelegationFormBalance onCustomizeClick={onCustomizeClick} />
        <DelegationFormSubmitButton />
        <DelegationFormFootNote />
        {/* TODO: TX STATUSES */}
      </DelegationFormController>
    </DelegationFormProvider>
  )
}
