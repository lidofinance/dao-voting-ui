import { useCallback } from 'react'
import invariant from 'tiny-invariant'
import { useTransactionSender } from 'modules/blockChain/hooks/useTransactionSender'
import { DelegationFormNetworkData, DelegationType } from '../types'
import { estimateDelegationGasLimit } from '../utils/estimateDelegationGasLimit'
import { SNAPSHOT_LIDO_SPACE_NAME } from '../constants'
import { useContractHelpers } from 'modules/blockChain/hooks/useContractHelpers'

type Args = {
  networkData: DelegationFormNetworkData
  onSubmitClick?: () => void
  onError?: () => void
  onFinish?: (hasError: boolean) => Promise<void>
}

export function useDelegationRevoke({
  networkData,
  onSubmitClick,
  onError,
  onFinish,
}: Args) {
  const { votingHelpers, snapshotHelpers } = useContractHelpers()
  const voting = votingHelpers.useWeb3()
  const snapshot = snapshotHelpers.useWeb3()

  const populateAragonRevoke = useCallback(async () => {
    const gasLimit = await estimateDelegationGasLimit(
      voting.estimateGas.unassignDelegate(),
    )

    const tx = await voting.populateTransaction.unassignDelegate({
      gasLimit,
    })
    return tx
  }, [voting.estimateGas, voting.populateTransaction])

  const txAragonRevoke = useTransactionSender(populateAragonRevoke, {
    onError,
  })

  const populateSnapshotRevoke = useCallback(async () => {
    const gasLimit = await estimateDelegationGasLimit(
      snapshot.estimateGas.clearDelegate(SNAPSHOT_LIDO_SPACE_NAME),
    )

    const tx = await snapshot.populateTransaction.clearDelegate(
      SNAPSHOT_LIDO_SPACE_NAME,
      { gasLimit },
    )
    return tx
  }, [snapshot.estimateGas, snapshot.populateTransaction])

  const txSnapshotRevoke = useTransactionSender(populateSnapshotRevoke, {
    onError,
  })

  const submitRevoke = useCallback(
    (type: DelegationType) => async () => {
      let hasError = false
      try {
        let tx
        onSubmitClick?.()
        if (type === 'aragon') {
          invariant(
            networkData.aragonDelegateAddress,
            'Aragon delegate address is required',
          )
          tx = await txAragonRevoke.send()
        }
        if (type === 'snapshot') {
          invariant(
            networkData.snapshotDelegateAddress,
            'Snapshot delegate address is required',
          )
          tx = await txSnapshotRevoke.send()
        }
        if (tx === null) {
          hasError = true
        } else if (tx?.type === 'regular') {
          await tx.tx.wait()
        }
      } catch (err) {
        hasError = true
        console.error(err)
      } finally {
        await onFinish?.(hasError)
      }
    },
    [
      networkData.aragonDelegateAddress,
      networkData.snapshotDelegateAddress,
      txAragonRevoke,
      txSnapshotRevoke,
      onSubmitClick,
      onFinish,
    ],
  )

  return {
    txAragonRevoke,
    txSnapshotRevoke,
    submitRevoke,
  }
}
