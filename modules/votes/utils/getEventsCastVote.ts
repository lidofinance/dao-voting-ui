import type { AragonVotingAbi } from 'generated'
import { CastVoteEvent } from '../types'

export function unifyEventsVotedWithLast(events: CastVoteEvent[]) {
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
      res: [] as CastVoteEvent[],
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
  const decoded = events.map(e => ({
    blockNumber: e.blockNumber,
    transactionIndex: e.transactionIndex,
    voter: e.args.voter,
    supports: e.args.supports,
    stake: e.args.stake,
  }))

  return unifyEventsVotedWithLast(decoded)
}

export async function getEventsAttemptCastVoteAsDelegate(
  contractVoting: AragonVotingAbi,
  castVoteEvents: CastVoteEvent[],
  voteId: string | number,
  block?: string | number,
) {
  const filter = contractVoting.filters.AttemptCastVoteAsDelegate(
    Number(voteId),
  )
  const delegateEvents = await contractVoting.queryFilter(
    filter,
    block ? Number(block) : undefined,
  )

  const voterToLatestVote = new Map<
    string,
    {
      blockNumber: number
      transactionIndex: number
      isDelegate: boolean
      delegate?: string
    }
  >()

  delegateEvents.forEach(event => {
    event.args.voters.forEach(voter => {
      const voterLower = voter.toLowerCase()
      const existing = voterToLatestVote.get(voterLower)
      if (
        !existing ||
        event.blockNumber > existing.blockNumber ||
        (event.blockNumber === existing.blockNumber &&
          event.transactionIndex > existing.transactionIndex)
      ) {
        voterToLatestVote.set(voterLower, {
          blockNumber: event.blockNumber,
          transactionIndex: event.transactionIndex,
          isDelegate: true,
          delegate: event.args.delegate,
        })
      }
    })
  })

  castVoteEvents.forEach(event => {
    const voterLower = event.voter.toLowerCase()
    const existing = voterToLatestVote.get(voterLower)
    if (
      !existing ||
      event.blockNumber > existing.blockNumber ||
      (event.blockNumber === existing.blockNumber &&
        event.transactionIndex > existing.transactionIndex)
    ) {
      voterToLatestVote.set(voterLower, {
        blockNumber: event.blockNumber,
        transactionIndex: event.transactionIndex,
        isDelegate: false,
      })
    }
  })

  return delegateEvents
    .map(event => {
      const filteredVoters = event.args.voters.filter(voter => {
        const latestVote = voterToLatestVote.get(voter.toLowerCase())
        return (
          latestVote &&
          latestVote.isDelegate &&
          latestVote.delegate === event.args.delegate &&
          latestVote.blockNumber === event.blockNumber &&
          latestVote.transactionIndex === event.transactionIndex
        )
      })
      return {
        ...event.args,
        voters: filteredVoters,
      }
    })
    .filter(event => event.voters.length > 0)
}
