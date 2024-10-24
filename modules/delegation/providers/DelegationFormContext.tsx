import {
  FC,
  useMemo,
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
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
import { isValidAddress } from 'modules/shared/utils/addressValidation'
import { useDelegateFromPublicList } from './DelegateFromPublicListContext'

//
// Data context
//
const DelegationFormDataContext = createContext<
  DelegationFormDataContextValue | undefined
>(undefined)

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
    aragonPublicDelegate: delegationInfo?.aragonPublicDelegate,
    snapshotDelegateAddress: delegationInfo?.snapshotDelegateAddress,
    snapshotPublicDelegate: delegationInfo?.snapshotPublicDelegate,
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

  const handleFinish = useCallback(
    async (hasError?: boolean) => {
      await networkData.revalidate()
      resetSubmitting()
      if (!hasError) {
        ToastSuccess('Transaction submitted successfully')
      }
    },
    [networkData, resetSubmitting],
  )

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
export type DelegationFormProviderProps = {
  mode: DelegationFormMode
}

export const DelegationFormProvider: FC<DelegationFormProviderProps> = ({
  children,
  mode,
}) => {
  const networkData = useDelegationFormNetworkData()
  const { selectedPublicDelegate, onPublicDelegateReset } =
    useDelegateFromPublicList()

  const formObject = useForm<DelegationFormInput>({
    defaultValues: { delegateAddress: '' },
    mode: 'onChange',
  })

  useEffect(() => {
    const currentValue = formObject.getValues('delegateAddress')
    if (
      selectedPublicDelegate &&
      isValidAddress(selectedPublicDelegate) &&
      currentValue?.toLowerCase() !== selectedPublicDelegate.toLowerCase()
    ) {
      formObject.setValue('delegateAddress', selectedPublicDelegate, {
        shouldValidate: true,
      })
      formObject.setFocus('delegateAddress')
      onPublicDelegateReset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPublicDelegate])

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
          register: formObject.register,
          watch: formObject.watch,
        }}
      >
        {children}
      </DelegationFormDataContext.Provider>
    </FormProvider>
  )
}
