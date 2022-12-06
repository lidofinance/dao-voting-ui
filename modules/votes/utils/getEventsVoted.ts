import type { VotingAbi } from 'generated'
import type { CastVoteEventObject } from 'generated/VotingAbi'

export async function getEventsVoted(
  contractVoting: VotingAbi,
  voteId: string | number,
  block?: string | number,
) {
  const filter = contractVoting.filters.CastVote(Number(voteId))
  const events = await contractVoting.queryFilter(
    filter,
    block ? Number(block) : undefined,
  )
  const decoded = events.map(e => e.decode!(e.data, e.topics))
  return decoded as CastVoteEventObject[]
}
