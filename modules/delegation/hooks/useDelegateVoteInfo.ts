import { useMemo } from 'react'
import type { AttemptCastVoteAsDelegateEventObject } from 'generated/AragonVotingAbi'
import { CastVoteEvent } from 'modules/votes/types'

interface Props {
  walletAddress: string | null | undefined
  eventsVoted: CastVoteEvent[] | undefined
  eventsDelegatesVoted: AttemptCastVoteAsDelegateEventObject[] | undefined
}

type DelegateVoteResult = {
  delegate: string
  supports: boolean
  stake: string
} | null

export function useDelegateVoteInfo({
  walletAddress,
  eventsVoted,
  eventsDelegatesVoted,
}: Props): DelegateVoteResult {
  return useMemo(() => {
    if (!walletAddress || !eventsVoted || !eventsDelegatesVoted) return null

    const delegateVote = eventsDelegatesVoted.find(event =>
      event.voters.includes(walletAddress),
    )

    if (!delegateVote) {
      return null
    }

    const vote = eventsVoted.find(
      event => event.voter.toLowerCase() === walletAddress.toLowerCase(),
    )

    if (!vote) {
      return null
    }

    return {
      delegate: delegateVote.delegate,
      supports: vote.supports,
      stake: vote.stake.toString(),
    }
  }, [walletAddress, eventsDelegatesVoted, eventsVoted])
}
