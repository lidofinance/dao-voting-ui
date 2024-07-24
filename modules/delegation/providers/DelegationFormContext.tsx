import {
  FC,
  useMemo,
  createContext,
  useContext,
  useCallback,
  useState,
} from 'react'
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
import { useDelegationFormSubmit } from '../hooks/useDelegationFormSubmit'
import { useDelegationRevoke } from '../hooks/useDelegationRevoke'
import { ToastSuccess } from '@lidofinance/lido-ui'

//
// Data context
//
const DelegationFormDataContext =
  createContext<DelegationFormDataContextValue | null>(null)

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

const useDelegationFormActions = (
  networkData: DelegationFormNetworkData,
  mode: DelegationFormMode,
) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setSubmitting = useCallback(() => setIsSubmitting(true), [])
  const resetSubmitting = useCallback(() => setIsSubmitting(false), [])

  const handleFinish = useCallback(async () => {
    await networkData.revalidate()
    resetSubmitting()
    ToastSuccess('Transaction submitted successfully')
  }, [networkData, resetSubmitting])

  const { txAragonDelegate, txSnapshotDelegate, submitDelegation } =
    useDelegationFormSubmit({
      mode,
      networkData,
      onSubmitClick: setSubmitting,
      onError: resetSubmitting,
      onFinish: handleFinish,
    })

  const { submitRevoke } = useDelegationRevoke({
    networkData,
    onSubmitClick: setSubmitting,
    onError: resetSubmitting,
    onFinish: handleFinish,
  })

  return {
    isSubmitting,
    txAragonDelegate,
    txSnapshotDelegate,
    submitDelegation,
    submitRevoke,
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

  const {
    isSubmitting,
    txAragonDelegate,
    txSnapshotDelegate,
    submitDelegation,
    submitRevoke,
  } = useDelegationFormActions(networkData, mode)

  return (
    <FormProvider {...formObject}>
      <DelegationFormDataContext.Provider
        value={{
          ...networkData,
          mode,
          isSubmitting,
          txAragonDelegate,
          txSnapshotDelegate,
          onSubmit: formObject.handleSubmit(submitDelegation),
          onRevoke: submitRevoke,
        }}
      >
        {children}
      </DelegationFormDataContext.Provider>
    </FormProvider>
  )
}