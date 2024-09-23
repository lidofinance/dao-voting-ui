import { useCallback, useState } from 'react'
import {
  useTransactionSender,
  FinishHandler,
} from 'modules/blockChain/hooks/useTransactionSender'

import { ContractVoting } from 'modules/blockChain/contracts'
import type { VoteMode } from '../../types'
import { estimateGasFallback } from 'modules/shared/utils/estimateGasFallback'

type Args = {
  voteId?: string
  onFinish?: FinishHandler
}

export function useFormVoteSubmit({ voteId, onFinish }: Args) {
  const contractVoting = ContractVoting.useWeb3()
  const [isSubmitting, setSubmitting] = useState<false | VoteMode>(false)

  const handleFinish = useCallback(
    (...args: Parameters<FinishHandler>) => {
      setSubmitting(false)
      onFinish?.(...args)
    },
    [setSubmitting, onFinish],
  )

  const handleError = useCallback(() => {
    setSubmitting(false)
  }, [])

  const populateVote = useCallback(
    async (args: { voteId: string; mode: VoteMode }) => {
      const gasLimit = await estimateGasFallback(
        contractVoting.estimateGas.vote(
          args.voteId,
          args.mode === 'yay',
          false,
        ),
      )
      const tx = await contractVoting.populateTransaction.vote(
        args.voteId,
        args.mode === 'yay',
        false,
        { gasLimit },
      )
      return tx
    },
    [contractVoting],
  )

  const txVote = useTransactionSender(populateVote, {
    onError: handleError,
    onFinish: handleFinish,
  })

  const handleVote = useCallback(
    async (mode: VoteMode) => {
      if (!voteId) return

      try {
        setSubmitting(mode)
        await txVote.send({ voteId, mode })
      } catch (err) {
        console.error(err)
        setSubmitting(false)
      }
    },
    [voteId, txVote],
  )

  const populateDelegatesVote = useCallback(
    async (args: { voteId: string; mode: VoteMode; voters: string[] }) => {
      const gasLimit = await estimateGasFallback(
        contractVoting.estimateGas.attemptVoteForMultiple(
          args.voteId,
          args.mode === 'yay',
          args.voters,
        ),
      )

      const tx =
        await contractVoting.populateTransaction.attemptVoteForMultiple(
          args.voteId,
          args.mode === 'yay',
          args.voters,
          { gasLimit },
        )

      return tx
    },
    [contractVoting],
  )
  const txDelegatesVote = useTransactionSender(populateDelegatesVote, {
    onError: handleError,
    onFinish: handleFinish,
  })

  const handleDelegatesVote = useCallback(
    async (mode: VoteMode, voters: string[]) => {
      if (!voteId) return

      try {
        setSubmitting(mode)
        await txDelegatesVote.send({ voteId, mode, voters })
      } catch (err) {
        console.error(err)
        setSubmitting(false)
      }
    },
    [voteId, txDelegatesVote],
  )

  const populateEnact = useCallback(
    async (args: { voteId: string }) => {
      const gasLimit = await estimateGasFallback(
        contractVoting.estimateGas.executeVote(args.voteId),
        2000000,
      )
      const tx = await contractVoting.populateTransaction.executeVote(
        args.voteId,
        { gasLimit },
      )
      return tx
    },
    [contractVoting],
  )
  const txEnact = useTransactionSender(populateEnact, {
    onError: handleError,
    onFinish: handleFinish,
  })

  const handleEnact = useCallback(async () => {
    if (!voteId) return
    try {
      setSubmitting('enact')
      await txEnact.send({ voteId })
    } catch (err) {
      console.error(err)
      setSubmitting(false)
    }
  }, [voteId, txEnact])

  return {
    txVote,
    txDelegatesVote,
    txEnact,
    handleVote,
    handleDelegatesVote,
    handleEnact,
    isSubmitting,
  }
}
