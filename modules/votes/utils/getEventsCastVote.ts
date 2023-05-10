import type { AragonVotingAbi } from 'generated'
import type { CastVoteEventObject } from 'generated/AragonVotingAbi'

export function unifyEventsVotedWithLast(events: CastVoteEventObject[]) {
  return events.reverse().reduce(
    (all, curr) => {
      const voter = curr.voter
      if (!all.already[voter]) {
        all.already[voter] = true
        all.res.push(curr)
      }
      return all
    },
    {
      already: {} as Record<string, boolean>,
      res: [] as CastVoteEventObject[],
    },
  ).res
}

export async function getEventsCastVote(
  contractVoting: AragonVotingAbi,
  voteId: string | number,
  block?: string | number,
) {
  const filter = contractVoting.filters.CastVote(Number(voteId))
  const events = await contractVoting.queryFilter(
    filter,
    block ? Number(block) : undefined,
  )
  const decoded = events.map(e =>
    e.decode!(e.data, e.topics),
  ) as CastVoteEventObject[]
  return unifyEventsVotedWithLast(decoded)
}
