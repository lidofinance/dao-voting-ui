import type { BigNumber } from 'ethers'
import type { VotingAbi } from 'generated'

type StartVoteEvent = [BigNumber, string, string] & {
  voteId: BigNumber
  creator: string
  metadata: string
}

export async function getEventStartVote(
  contractVoting: VotingAbi,
  voteId: string | number,
  block?: string | number,
) {
  const filter = contractVoting.filters.StartVote(Number(voteId))
  const events = await contractVoting.queryFilter(
    filter,
    block ? Number(block) : undefined,
    block ? Number(block) + 1 : undefined,
  )
  const event = events[0]
  if (!events[0] || !event.decode) {
    throw new Error('Start vote event parsing error')
  }
  const decoded = event.decode(event.data, event.topics)
  return decoded as StartVoteEvent
}