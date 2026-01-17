import { TransactionSender } from 'modules/blockChain/hooks/useTransactionSender'
import { UseFormRegister, UseFormWatch } from 'react-hook-form'
import { PUBLIC_DELEGATES } from './publicDelegates'

export type DelegationInfo = {
  aragonDelegateAddress: string | null | undefined
  aragonPublicDelegate: PublicDelegate | null | undefined
  snapshotDelegateAddress: string | null | undefined
  snapshotPublicDelegate: PublicDelegate | null | undefined
}

export type DelegationFormInput = {
  delegateAddress: string | null
}

export type DelegationFormLoading = {
  isTokenDataLoading: boolean
  isDelegationInfoLoading: boolean
}

export type DelegationFormNetworkData = {
  governanceBalanceStr?: string
  loading: DelegationFormLoading
  revalidate: () => Promise<void>
} & DelegationInfo

export type DelegationType = 'aragon' | 'snapshot'

export type DelegationFormMode = 'simple' | DelegationType

export type DelegationFormDataContextValue = DelegationFormNetworkData & {
  mode: DelegationFormMode
  isSubmitting: boolean
  txAragonDelegate: TransactionSender
  txSnapshotDelegate: TransactionSender
  isFlowBlocked: boolean
  onSubmit: () => void
  onRevoke: (type: DelegationType) => () => Promise<void>
  register: UseFormRegister<DelegationFormInput>
  watch: UseFormWatch<DelegationFormInput>
}

export type PublicDelegate = typeof PUBLIC_DELEGATES[number]
