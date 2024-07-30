import type { AragonVotingAbi } from 'generated'
import type {
  CastVoteEventObject,
  AttemptCastVoteAsDelegateEventObject,
} from 'generated/AragonVotingAbi'

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

export async function getEventsAttemptCastVoteAsDelegate(
  contractVoting: AragonVotingAbi,
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

  const castVoteFilter = contractVoting.filters.CastVote(Number(voteId))
  const castVoteEvents = await contractVoting.queryFilter(
    castVoteFilter,
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
    const decodedEvent = event.decode!(
      event.data,
      event.topics,
    ) as AttemptCastVoteAsDelegateEventObject
    decodedEvent.voters.forEach(voter => {
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
          delegate: decodedEvent.delegate,
        })
      }
    })
  })

  castVoteEvents.forEach(event => {
    const decodedEvent = event.decode!(
      event.data,
      event.topics,
    ) as CastVoteEventObject
    const voterLower = decodedEvent.voter.toLowerCase()
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
      const decodedEvent = event.decode!(
        event.data,
        event.topics,
      ) as AttemptCastVoteAsDelegateEventObject
      const filteredVoters = decodedEvent.voters.filter(voter => {
        const latestVote = voterToLatestVote.get(voter.toLowerCase())
        return (
          latestVote &&
          latestVote.isDelegate &&
          latestVote.delegate === decodedEvent.delegate &&
          latestVote.blockNumber === event.blockNumber &&
          latestVote.transactionIndex === event.transactionIndex
        )
      })
      return {
        ...decodedEvent,
        voters: filteredVoters,
      }
    })
    .filter(event => event.voters.length > 0)
}
