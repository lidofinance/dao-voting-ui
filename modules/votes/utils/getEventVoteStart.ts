import type {
  AragonVotingAbi,
  StartVoteEventObject,
} from 'generated/AragonVotingAbi'

export async function getEventStartVote(
  contractVoting: AragonVotingAbi,
  voteId: string | number,
  block?: string | number,
): Promise<StartVoteEventObject | null> {
  const filter = contractVoting.filters.StartVote(Number(voteId))
  const events = await contractVoting.queryFilter(
    filter,
    block ? Number(block) : undefined,
    block ? Number(block) + 1 : undefined,
  )

  if (!events.length) {
    return null
  }

  return events[0].args
}
