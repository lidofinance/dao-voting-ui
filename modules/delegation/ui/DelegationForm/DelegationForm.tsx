import {
  DelegationFormProvider,
  DelegationFormProviderProps,
} from 'modules/delegation/providers/DelegationFormContext'
import { DelegationStatus } from './DelegationStatus/DelegationStatus'
import { DelegationFormSubtitle } from './DelegationFormSubtitle'
import { DelegationAddressInput } from './DelegationAddressInput'
import { DelegationFormBalance } from './DelegationFormBalance'
import { DelegationFormSubmitButton } from './DelegationFormSubmitButton'
import { DelegationFormFootNote } from './DelegationFormFootNote'
import { DelegationFormController } from './DelegationFormController'
import { DelegationTxStatus } from './DelegationTxStatus'

type Props = DelegationFormProviderProps & {
  onCustomizeClick?: () => void
}

export function DelegationForm({ onCustomizeClick, ...providerProps }: Props) {
  return (
    <DelegationFormProvider {...providerProps}>
      <DelegationFormController>
        <DelegationFormSubtitle />
        <DelegationStatus />
        <DelegationAddressInput />
        <DelegationFormBalance onCustomizeClick={onCustomizeClick} />
        <DelegationFormSubmitButton onCustomizeClick={onCustomizeClick} />
        <DelegationFormFootNote />
        <DelegationTxStatus />
      </DelegationFormController>
    </DelegationFormProvider>
  )
}
