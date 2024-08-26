import { TransactionSender } from 'modules/blockChain/hooks/useTransactionSender'
import { UseFormRegister, UseFormWatch } from 'react-hook-form'

export type DelegationFormInput = {
  delegateAddress: string | null
}

export type DelegationFormLoading = {
  isGovernanceBalanceLoading: boolean
  isDelegationInfoLoading: boolean
}

export type DelegationFormNetworkData = {
  aragonDelegateAddress?: string | null
  snapshotDelegateAddress?: string | null
  governanceBalanceStr?: string
  loading: DelegationFormLoading
  revalidate: () => Promise<void>
}

export type DelegationType = 'aragon' | 'snapshot'

export type DelegationFormMode = 'simple' | DelegationType

export type DelegationFormDataContextValue = DelegationFormNetworkData & {
  mode: DelegationFormMode
  isSubmitting: boolean
  txAragonDelegate: TransactionSender
  txSnapshotDelegate: TransactionSender
  onSubmit: () => void
  onRevoke: (type: DelegationType) => () => Promise<void>
  register: UseFormRegister<DelegationFormInput>
  watch: UseFormWatch<DelegationFormInput>
}
