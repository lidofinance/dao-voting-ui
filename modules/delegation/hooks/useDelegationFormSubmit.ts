import { useCallback } from 'react'
import invariant from 'tiny-invariant'
import { ContractSnapshot, ContractVoting } from 'modules/blockChain/contracts'
import { useTransactionSender } from 'modules/blockChain/hooks/useTransactionSender'
import {
  DelegationFormInput,
  DelegationFormMode,
  DelegationFormNetworkData,
} from '../types'
import { NonNullableMembers } from 'modules/shared/utils/utilTypes'
import { estimateDelegationGasLimit } from '../utils/estimateDelegationGasLimit'
import { SNAPSHOT_LIDO_SPACE_NAME } from '../constants'
import type { ResultTx } from '../../blockChain/types'

type Args = {
  networkData: DelegationFormNetworkData
  mode: DelegationFormMode
  onSubmitClick?: () => void
  onError?: () => void
  onFinish?: (hasError?: boolean) => Promise<void>
}

type TxDelegate = {
  send: (
    args: NonNullableMembers<DelegationFormInput>,
  ) => Promise<ResultTx | null>
}

type FormData = NonNullableMembers<DelegationFormInput>

export function useDelegationFormSubmit({
  networkData,
  mode,
  onSubmitClick,
  onError,
  onFinish,
}: Args) {
  const voting = ContractVoting.useWeb3()
  const snapshot = ContractSnapshot.useWeb3()

  const populateAragonDelegate = useCallback(
    async (args: FormData) => {
      const gasLimit = await estimateDelegationGasLimit(
        voting.estimateGas.assignDelegate(args.delegateAddress),
      )

      const tx = await voting.populateTransaction.assignDelegate(
        args.delegateAddress,
        { gasLimit },
      )
      return tx
    },
    [voting.estimateGas, voting.populateTransaction],
  )

  const txAragonDelegate = useTransactionSender(populateAragonDelegate, {
    onError,
  })

  const populateSnapshotDelegate = useCallback(
    async (args: FormData) => {
      const gasLimit = await estimateDelegationGasLimit(
        snapshot.estimateGas.setDelegate(
          SNAPSHOT_LIDO_SPACE_NAME,
          args.delegateAddress,
        ),
      )

      const tx = await snapshot.populateTransaction.setDelegate(
        SNAPSHOT_LIDO_SPACE_NAME,
        args.delegateAddress,
        { gasLimit },
      )
      return tx
    },
    [snapshot.estimateGas, snapshot.populateTransaction],
  )

  const txSnapshotDelegate = useTransactionSender(populateSnapshotDelegate, {
    onError,
  })

  const delegate = useCallback(
    async (txDelegate: TxDelegate, address: string) => {
      const tx = await txDelegate.send({ delegateAddress: address })
      if (tx === null) {
        return false
      }
      if (tx.type === 'regular') {
        await tx.tx.wait()
      }
      return true
    },
    [],
  )

  const submitDelegation = useCallback(
    async ({ delegateAddress }: DelegationFormInput) => {
      let hasError = false
      try {
        invariant(delegateAddress, 'Delegate address is required')
        const loweredDelegateAddress = delegateAddress.toLowerCase()
        onSubmitClick?.()
        if (mode === 'simple') {
          if (loweredDelegateAddress !== networkData.aragonDelegateAddress) {
            const success = await delegate(txAragonDelegate, delegateAddress)
            if (!success) {
              hasError = true
            }
          }
          if (loweredDelegateAddress !== networkData.snapshotDelegateAddress) {
            const success = await delegate(txSnapshotDelegate, delegateAddress)
            if (!success) {
              hasError = true
            }
          }
        } else {
          const txDelegate =
            mode === 'aragon' ? txAragonDelegate : txSnapshotDelegate
          const success = await delegate(txDelegate, delegateAddress)
          if (!success) {
            hasError = true
          }
        }
      } catch (err) {
        hasError = true
        console.error(err)
      } finally {
        await onFinish?.(hasError)
      }
    },
    [
      mode,
      networkData.aragonDelegateAddress,
      networkData.snapshotDelegateAddress,
      txAragonDelegate,
      txSnapshotDelegate,
      onSubmitClick,
      onFinish,
      delegate,
    ],
  )

  return {
    txAragonDelegate,
    txSnapshotDelegate,
    submitDelegation,
  }
}
