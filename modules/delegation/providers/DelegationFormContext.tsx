import { FC, useMemo, createContext, useContext, useCallback } from 'react'
import { useGovernanceBalance } from 'modules/tokens/hooks/useGovernanceBalance'
import { useDelegationInfo } from '../hooks/useDelegationInfo'
import invariant from 'tiny-invariant'
import { FormProvider, useForm } from 'react-hook-form'
import {
  DelegationFormDataContextValue,
  DelegationFormInput,
  DelegationFormNetworkData,
  DelegationFormMode,
} from '../types'

//
// Data context
//
const DelegationFormDataContext =
  createContext<DelegationFormDataContextValue | null>(null)
DelegationFormDataContext.displayName = 'DelegationFormDataContext'

export const useDelegationFormData = () => {
  const value = useContext(DelegationFormDataContext)
  invariant(
    value,
    'useDelegationFormData was used outside the DelegationFormDataContext provider',
  )
  return value
}

const useDelegationFormNetworkData = (): DelegationFormNetworkData => {
  const {
    data: governanceBalance,
    initialLoading: isGovernanceBalanceLoading,
  } = useGovernanceBalance()

  const {
    data: delegationInfo,
    initialLoading: isDelegationInfoLoading,
    update: updateGovernanceInfo,
  } = useDelegationInfo()

  const revalidate = useCallback(async () => {
    await updateGovernanceInfo()
  }, [updateGovernanceInfo])

  const loading = useMemo(
    () => ({
      isDelegationInfoLoading,
      isGovernanceBalanceLoading,
    }),
    [isDelegationInfoLoading, isGovernanceBalanceLoading],
  )

  return {
    aragonDelegateAddress: delegationInfo?.aragonDelegateAddress,
    snapshotDelegateAddress: delegationInfo?.snapshotDelegateAddress,
    governanceBalanceStr: governanceBalance?.balanceStr,
    loading,
    revalidate,
  }
}

//
// Data provider
//
export const DelegationFormProvider: FC<{ mode: DelegationFormMode }> = ({
  children,
  mode,
}) => {
  const networkData = useDelegationFormNetworkData()

  const formObject = useForm<DelegationFormInput>({
    defaultValues: { delegateAddress: null },
    mode: 'onChange',
  })

  return (
    <FormProvider {...formObject}>
      <DelegationFormDataContext.Provider value={{ ...networkData, mode }}>
        {children}
      </DelegationFormDataContext.Provider>
    </FormProvider>
  )
}
