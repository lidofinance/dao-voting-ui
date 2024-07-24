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

type Args = {
  networkData: DelegationFormNetworkData
  mode: DelegationFormMode
  onSubmitClick?: () => void
  onError?: () => void
  onFinish?: () => Promise<void>
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

  const txSnapshotDelegate = useTransactionSender(populateSnapshotDelegate)

  const submitDelegation = useCallback(
    async ({ delegateAddress }: DelegationFormInput) => {
      try {
        invariant(delegateAddress, 'Delegate address is required')
        const loweredDelegateAddress = delegateAddress.toLowerCase()
        onSubmitClick?.()
        if (mode === 'simple') {
          if (loweredDelegateAddress !== networkData.aragonDelegateAddress) {
            const aragonTx = await txAragonDelegate.send({ delegateAddress })
            if (aragonTx?.type === 'regular') {
              await aragonTx.tx.wait()
            }
          }
          if (loweredDelegateAddress !== networkData.snapshotDelegateAddress) {
            const snapshotTx = await txSnapshotDelegate.send({
              delegateAddress,
            })
            if (snapshotTx?.type === 'regular') {
              await snapshotTx.tx.wait()
            }
          }
        } else {
          const txDelegate =
            mode === 'aragon' ? txAragonDelegate : txSnapshotDelegate
          const tx = await txDelegate.send({ delegateAddress })
          if (tx?.type === 'regular') {
            await tx.tx.wait()
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        await onFinish?.()
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
    ],
  )

  return {
    txAragonDelegate,
    txSnapshotDelegate,
    submitDelegation,
  }
}
