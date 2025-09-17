import {
  FC,
  useMemo,
  createContext,
  useContext,
  useCallback,
  useState,
} from 'react'
import { useGovernanceTokenData } from 'modules/tokens/hooks/useGovernanceTokenData'
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
import { useProcessedPublicDelegatesList } from '../ui/PublicDelegateList/useProcessedPublicDelegatesList'
import { useDelegateFromPublicListUpdate } from '../hooks/useDelegateFromPublicListUpdate'
import { useDelegateFromQueryUpdate } from '../hooks/useDelegateFromQueryUpdate'
import { useIsChainSupported } from 'modules/blockChain/hooks/useIsChainSupported'

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
  const { data: governanceBalance, initialLoading: isTokenDataLoading } =
    useGovernanceTokenData()

  const {
    data: delegationInfo,
    initialLoading: isDelegationInfoLoading,
    mutate: updateGovernanceInfo,
  } = useDelegationInfo()

  const revalidate = useCallback(async () => {
    await updateGovernanceInfo(undefined, true)
  }, [updateGovernanceInfo])

  const loading = useMemo(
    () => ({
      isDelegationInfoLoading,
      isTokenDataLoading,
    }),
    [isDelegationInfoLoading, isTokenDataLoading],
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

  const { mutate } = useProcessedPublicDelegatesList()

  const handleFinish = useCallback(
    async (hasError?: boolean) => {
      await networkData.revalidate()
      await mutate(undefined, true)
      resetSubmitting()
      if (!hasError) {
        ToastSuccess('Transaction submitted successfully')
      }
    },
    [networkData, resetSubmitting, mutate],
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
  children?: React.ReactNode
}

export const DelegationFormProvider: FC<DelegationFormProviderProps> = ({
  children,
  mode,
}) => {
  const networkData = useDelegationFormNetworkData()
  const isChainSupported = useIsChainSupported()

  const formObject = useForm<DelegationFormInput>({
    defaultValues: { delegateAddress: '' },
    mode: 'onChange',
  })

  useDelegateFromPublicListUpdate(formObject)

  useDelegateFromQueryUpdate(formObject)

  const {
    isSubmitting,
    txAragonDelegate,
    txSnapshotDelegate,
    submitDelegation,
    submitRevoke,
  } = useDelegationFormActions(networkData, mode)

  const isFlowBlocked = useMemo(() => !isChainSupported, [isChainSupported])

  return (
    <FormProvider {...formObject}>
      <DelegationFormDataContext.Provider
        value={{
          ...networkData,
          mode,
          isSubmitting,
          txAragonDelegate,
          txSnapshotDelegate,
          isFlowBlocked,
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
