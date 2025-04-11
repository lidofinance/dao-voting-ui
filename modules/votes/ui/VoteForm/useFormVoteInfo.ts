import { noop } from 'lodash'
import { formatEther } from 'ethers/lib/utils'
import { useCallback, useEffect } from 'react'
import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import { getEventExecuteVote } from 'modules/votes/utils/getEventExecuteVote'
import { getVoteStatus } from 'modules/votes/utils/getVoteStatus'
import { getEventStartVote } from 'modules/votes/utils/getEventVoteStart'
import {
  getEventsCastVote,
  getEventsAttemptCastVoteAsDelegate,
} from 'modules/votes/utils/getEventsCastVote'
import { useContractHelpers } from 'modules/blockChain/hooks/useContractHelpers'

type Args = {
  voteId?: string
}

export function useFormVoteInfo({ voteId }: Args) {
  const { chainId, walletAddress, isWalletConnected } = useWeb3()
  const { ldoHelpers, votingHelpers } = useContractHelpers()
  const voting = votingHelpers.useRpc()
  const ldo = ldoHelpers.useRpc()

  const swrVote = useSWR(
    voteId ? [`vote-info`, voteId, walletAddress, chainId] : null,
    async (_, _voteId: typeof voteId, _walletAddress: typeof walletAddress) => {
      if (!_voteId) return null

      const [voteTime, objectionPhaseTime, vote, canExecute, votePhase] =
        await Promise.all([
          voting.voteTime(),
          voting.objectionPhaseTime(),
          voting.getVote(_voteId),
          voting.canExecute(_voteId),
          voting.getVotePhase(_voteId),
        ])

      const snapshotBlock = vote.snapshotBlock.toNumber()
      const eventsVoted = await getEventsCastVote(
        voting,
        _voteId,
        snapshotBlock,
      )
      const [
        eventStart,
        eventsDelegatesVoted,
        eventExecuteVote,
        canVote,
        voterState,
        votePowerWei,
      ] = await Promise.all([
        getEventStartVote(voting, _voteId, snapshotBlock),
        getEventsAttemptCastVoteAsDelegate(
          voting,
          eventsVoted,
          _voteId,
          snapshotBlock,
        ),
        getEventExecuteVote(voting, _voteId, snapshotBlock),
        _walletAddress ? voting.canVote(_voteId, _walletAddress) : false,
        _walletAddress ? voting.getVoterState(_voteId, _walletAddress) : null,
        _walletAddress
          ? ldo.balanceOfAt(_walletAddress, vote.snapshotBlock)
          : null,
      ])

      const votePower = votePowerWei ? Number(formatEther(votePowerWei)) : 0

      return {
        voteTime,
        objectionPhaseTime,
        vote,
        canVote,
        canExecute,
        voterState,
        votePower,
        eventStart,
        eventsVoted,
        eventsDelegatesVoted,
        eventExecuteVote,
        votePowerWei,
        votePhase,
        status: getVoteStatus(vote, canExecute),
      }
    },
    { onError: noop },
  )

  const vote = swrVote.data?.vote
  const startDate = vote?.startDate.toNumber()
  const voteTime = swrVote.data?.voteTime.toNumber()
  const objectionPhaseTime = swrVote.data?.objectionPhaseTime.toNumber()
  const votePower = swrVote.data?.votePower
  const votePowerWei = swrVote.data?.votePowerWei
  const voterState = swrVote.data?.voterState
  const canVote = Boolean(swrVote.data?.canVote)
  const canExecute = swrVote.data?.canExecute
  const isLoading = swrVote.initialLoading
  const votePhase = swrVote.data?.votePhase

  const mutateFn = swrVote.mutate
  const doRevalidate = useCallback(() => {
    // TODO:
    // Immediate revalidation glitches sometimes:
    // It appears accidentally when we fetch data that was changed immediately after the change. It returns it's old version from chain.
    // Small timeout is a fix for this glitch.
    // That's why there is timeout
    setTimeout(() => mutateFn(), 1200)
  }, [mutateFn])

  useEffect(() => {
    const eventFilter = voting.filters.CastVote(Number(voteId))
    voting.on(eventFilter, doRevalidate)
    return () => {
      voting.off(eventFilter, doRevalidate)
    }
  }, [doRevalidate, voting, voteId])

  return {
    swrVote,
    vote,
    voteTime,
    votePower,
    voterState,
    startDate,
    objectionPhaseTime,
    canVote,
    canExecute,
    isLoading,
    isWalletConnected,
    walletAddress,
    doRevalidate,
    votePowerWei,
    votePhase,
    eventStart: swrVote.data?.eventStart,
    eventsVoted: swrVote.data?.eventsVoted,
    eventsDelegatesVoted: swrVote.data?.eventsDelegatesVoted,
    eventExecuteVote: swrVote.data?.eventExecuteVote,
    status: swrVote.data?.status,
    mutate: mutateFn,
  }
}
