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
  isSnapshotDelegationSupported?: boolean
  loading: DelegationFormLoading
  revalidate: () => Promise<void>
}

export type DelegationFormMode = 'simple' | 'aragon' | 'snapshot'

export type DelegationFormDataContextValue = DelegationFormNetworkData & {
  mode: DelegationFormMode
}
