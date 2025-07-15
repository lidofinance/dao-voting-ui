import { useMemo } from 'react'
import { VoteEvent } from 'modules/votes/types'

interface Props {
  walletAddress: string | null | undefined
  voteEvents: VoteEvent[] | undefined
}

export function useDelegateVoteInfo({
  walletAddress,
  voteEvents,
}: Props): VoteEvent | null {
  return useMemo(() => {
    if (!walletAddress || !voteEvents) return null

    const delegateVote = voteEvents.find(
      event =>
        event.delegatedVotes?.length &&
        event.delegatedVotes.findIndex(
          vote => vote.voter.toLowerCase() === walletAddress.toLowerCase(),
        ) !== -1,
    )

    return delegateVote ?? null
  }, [walletAddress, voteEvents])
}
