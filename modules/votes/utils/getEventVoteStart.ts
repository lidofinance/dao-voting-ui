import type {
  AragonVotingAbi,
  StartVoteEvent,
  StartVoteEventObject,
} from 'generated/AragonVotingAbi'

export async function getEventStartVote(
  contractVoting: AragonVotingAbi,
  voteId: string | number,
  block?: string | number,
): Promise<{
  event: StartVoteEvent
  decoded: StartVoteEventObject
} | null> {
  const filter = contractVoting.filters.StartVote(Number(voteId))
  const events = await contractVoting.queryFilter(
    filter,
    block ? Number(block) : undefined,
    block ? Number(block) + 1 : undefined,
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
