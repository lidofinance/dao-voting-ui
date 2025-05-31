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
  executedAt: number | undefined
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

  let executedAt: number | undefined

  try {
    const executeBlock = await event.getBlock()
    executedAt = executeBlock.timestamp
  } catch (error) {
    console.error('Failed to get block for ExecuteVote event', error)
  }

  return {
    event,
    decoded: event.args,
    executedAt,
  }
}
