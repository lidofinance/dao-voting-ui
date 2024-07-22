import { ContractSnapshot, ContractVoting } from 'modules/blockChain/contracts'
import {
  FinishHandler,
  useTransactionSender,
} from 'modules/blockChain/hooks/useTransactionSender'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { DelegationFormInput, DelegationFormMode } from '../types'
import { NonNullableMembers } from 'modules/shared/utils/utilTypes'
import { estimateDelegationGasLimit } from '../utils/estimateDelegationGasLimit'
import { SNAPSHOT_LIDO_SPACE_NAME } from '../constants'
import invariant from 'tiny-invariant'
import { isSnapshotSupported } from '../utils/isSnapshotSupported'
import { getChainName } from 'modules/blockChain/chains'
import { useCallback } from 'react'

type Args = {
  mode: DelegationFormMode
  onFinish?: FinishHandler
}

type FormData = NonNullableMembers<DelegationFormInput>

export function useDelegationFormSubmit({ mode, onFinish }: Args) {
  const { chainId, library } = useWeb3()
  const voting = ContractVoting.useWeb3()

  const populateAragonDelegate = useCallback(
    async (args: FormData) => {
      const gasLimit = await estimateDelegationGasLimit(
        voting.estimateGas.setDelegate(args.delegateAddress),
      )

      const tx = await voting.populateTransaction.setDelegate(
        args.delegateAddress,
        { gasLimit },
      )
      return tx
    },
    [voting.estimateGas, voting.populateTransaction],
  )

  const txAragonDelegate = useTransactionSender(populateAragonDelegate, {
    onFinish,
  })

  const populateSnapshotDelegate = useCallback(
    async (args: FormData) => {
      invariant(library, 'Snapshot delegation: user is not connected')
      invariant(
        isSnapshotSupported(chainId),
        `Snapshot delegation: network ${getChainName(
          chainId,
        )} is not supported`,
      )

      const snapshot = ContractSnapshot.connect({ chainId, library })
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
    [chainId, library],
  )

  const txSnapshotDelegate = useTransactionSender(populateSnapshotDelegate, {
    onFinish,
  })

  const submitDelegation = useCallback(
    async ({ delegateAddress }: DelegationFormInput) => {
      invariant(delegateAddress, 'Delegate address is required')
      try {
        if (mode === 'simple' || mode === 'aragon') {
          await txAragonDelegate.send({ delegateAddress })
        }
        if (
          (mode === 'simple' || mode === 'snapshot') &&
          isSnapshotSupported(chainId)
        ) {
          await txSnapshotDelegate.send({ delegateAddress })
        }
        return true
      } catch (err) {
        console.error(err)
        return false
      }
    },
    [mode, txAragonDelegate, txSnapshotDelegate, chainId],
  )

  return {
    txAragonDelegate,
    txSnapshotDelegate,
    submitDelegation,
  }
}
