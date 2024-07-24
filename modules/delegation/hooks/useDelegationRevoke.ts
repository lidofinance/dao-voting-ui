import { useCallback } from 'react'
import invariant from 'tiny-invariant'
import { ContractSnapshot, ContractVoting } from 'modules/blockChain/contracts'
import {
  FinishHandler,
  useTransactionSender,
} from 'modules/blockChain/hooks/useTransactionSender'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { DelegationFormNetworkData, DelegationType } from '../types'
import { estimateDelegationGasLimit } from '../utils/estimateDelegationGasLimit'
import { SNAPSHOT_LIDO_SPACE_NAME } from '../constants'

type Args = {
  networkData: DelegationFormNetworkData
  onSubmitClick?: () => void
  onError?: () => void
  onFinish?: FinishHandler
}

export function useDelegationRevoke({
  networkData,
  onSubmitClick,
  onError,
  onFinish,
}: Args) {
  const { chainId, library } = useWeb3()
  const voting = ContractVoting.useWeb3()

  const populateAragonRevoke = useCallback(async () => {
    const gasLimit = await estimateDelegationGasLimit(
      voting.estimateGas.unassignDelegate(),
    )

    const tx = await voting.populateTransaction.unassignDelegate({ gasLimit })
    return tx
  }, [voting.estimateGas, voting.populateTransaction])

  const txAragonRevoke = useTransactionSender(populateAragonRevoke, {
    onFinish,
    onError,
  })

  const populateSnapshotRevoke = useCallback(async () => {
    invariant(library, 'Snapshot delegation: user is not connected')

    const snapshot = ContractSnapshot.connect({ chainId, library })
    const gasLimit = await estimateDelegationGasLimit(
      snapshot.estimateGas.clearDelegate(SNAPSHOT_LIDO_SPACE_NAME),
    )

    const tx = await snapshot.populateTransaction.clearDelegate(
      SNAPSHOT_LIDO_SPACE_NAME,
      { gasLimit },
    )
    return tx
  }, [chainId, library])

  const txSnapshotRevoke = useTransactionSender(populateSnapshotRevoke, {
    onFinish,
  })

  const submitRevoke = useCallback(
    (type: DelegationType) => async () => {
      try {
        onSubmitClick?.()
        if (type === 'aragon') {
          invariant(
            networkData.aragonDelegateAddress,
            'Aragon delegate address is required',
          )

          await txAragonRevoke.send()
        }
        if (type === 'snapshot') {
          invariant(
            networkData.snapshotDelegateAddress,
            'Snapshot delegate address is required',
          )

          await txSnapshotRevoke.send()
        }
      } catch (err) {
        console.error(err)
      }
    },
    [
      networkData.aragonDelegateAddress,
      networkData.snapshotDelegateAddress,
      txAragonRevoke,
      txSnapshotRevoke,
      onSubmitClick,
    ],
  )

  return {
    txAragonRevoke,
    txSnapshotRevoke,
    submitRevoke,
  }
}
