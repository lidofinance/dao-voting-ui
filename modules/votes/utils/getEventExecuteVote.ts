import type {
  AragonVotingAbi,
  ExecuteVoteEvent,
  ExecuteVoteEventObject,
} from 'generated/AragonVotingAbi'

export async function getEventExecuteVote(
  contractVoting: AragonVotingAbi,
  voteId: string | number,
  block?: string | number,
): Promise<{
  event: ExecuteVoteEvent
  decoded: ExecuteVoteEventObject
} | null> {
  const filter = contractVoting.filters.ExecuteVote(Number(voteId))
  const events = await contractVoting.queryFilter(
    filter,
    block ? Number(block) : undefined,
  )
  if (!events.length) {
    return null
  }
  const event = events[0]

  return {
    event,
    decoded: event.args,
  }
}
