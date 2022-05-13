import { useCallback, useState } from 'react'
import { useTransactionSender } from 'modules/blockChain/hooks/useTransactionSender'

import { ContractVoting } from 'modules/blockChain/contracts'
// import { estimateGasFallback } from 'modules/shared/utils/estimateGasFallback'

type VoteMode = 'yay' | 'nay'

type Args = {
  voteId?: string
}

export function useFormVoteSubmit({ voteId }: Args) {
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
  const txVote = useTransactionSender(populateVote)

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

      setSubmitting(false)
    },
    [voteId, txVote],
  )

  return {
    txVote,
    handleVote,
    isSubmitting,
  }
}
