import { useCallback, useState } from 'react'
import {
  useTransactionSender,
  Options,
} from 'modules/blockChain/hooks/useTransactionSender'

import { ContractVoting } from 'modules/blockChain/contracts'
import type { VoteMode } from '../../types'
// import { estimateGasFallback } from 'modules/shared/utils/estimateGasFallback'

type Args = {
  voteId?: string
  onFinish?: Options['onFinish']
}

export function useFormVoteSubmit({ voteId, onFinish }: Args) {
  const contractVoting = ContractVoting.useWeb3()
  const [isSubmitting, setSubmitting] = useState<false | VoteMode>(false)

  const populateVote = useCallback(
    async (args: { voteId: string; mode: VoteMode }) => {
      const tx = await contractVoting.populateTransaction.vote(
        args.voteId,
        args.mode === 'yay',
        false,
        {
          gasLimit: 650000,
        },
      )
      return tx
    },
    [contractVoting],
  )
  const txVote = useTransactionSender(populateVote, { onFinish })

  const handleVote = useCallback(
    async (mode: VoteMode) => {
      if (!voteId) return

      try {
        setSubmitting(mode)
        //
        //       Gas amount can not be estimating for unknown reason
        // TODO: Figure out why
        //
        // const gasLimit = await estimateGasFallback(
        //   contractVoting.estimateGas.vote(voteId, mode === 'yay', false),
        // )
        //
        await txVote.send({ voteId, mode })
      } catch (err) {
        console.error(err)
      }
    },
    [voteId, txVote],
  )

  return {
    txVote,
    handleVote,
    isSubmitting,
  }
}
