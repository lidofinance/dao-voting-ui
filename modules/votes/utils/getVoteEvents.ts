import type { AragonVotingAbi } from 'generated'
import { BigNumber } from 'ethers'
import { VoteEvent, VoteInfo, VoteMetadata } from '../types'

export async function getVoteEvents(
  contractVoting: AragonVotingAbi,
  voteId: string | number,
  block?: string | number,
): Promise<VoteEvent[]> {
  const voteIdNum = Number(voteId)
  const fromBlock = block ? Number(block) : undefined
  const castVoteEvents = await contractVoting.queryFilter(
    contractVoting.filters.CastVote(voteIdNum),
    fromBlock,
  )

  if (castVoteEvents.length === 0) {
    return []
  }

  const votesMap: Record<string, (VoteInfo & VoteMetadata) | undefined> = {}

  for (const event of castVoteEvents) {
    const key = `${event.args.voter.toLowerCase()}-${event.blockNumber}-${
      event.transactionIndex
    }`

    votesMap[key] = {
      blockNumber: event.blockNumber,
      transactionIndex: event.transactionIndex,
      voter: event.args.voter,
      supports: event.args.supports,
      stake: event.args.stake,
    }
  }

  const delegateEvents = await contractVoting.queryFilter(
    contractVoting.filters.AttemptCastVoteAsDelegate(voteIdNum),
    fromBlock,
  )

  const result: VoteEvent[] = []

  let delegatedVotes: VoteEvent[] = []

  for (const delegateEvent of delegateEvents) {
    for (const voter of delegateEvent.args.voters) {
      const key = `${voter.toLowerCase()}-${delegateEvent.blockNumber}-${
        delegateEvent.transactionIndex
      }`
      const existingVote = votesMap[key]

      if (existingVote) {
        delegatedVotes.push({
          stake: existingVote.stake,
          voter: existingVote.voter,
          supports: existingVote.supports,
          blockNumber: delegateEvent.blockNumber,
          transactionIndex: delegateEvent.transactionIndex,
        })

        delete votesMap[key]
      }
    }

    if (delegatedVotes.length > 0) {
      const delegateStake = delegatedVotes.reduce(
        (acc, v) => acc.add(v.stake),
        BigNumber.from(0),
      )
      const delegateSupports = delegatedVotes[0].supports
      const sortedVotes = delegatedVotes.sort((a, b) => {
        return a.stake.gt(b.stake) ? -1 : 1
      })
      result.push({
        voter: delegateEvent.args.delegate,
        delegatedVotes: sortedVotes,
        blockNumber: delegateEvent.blockNumber,
        transactionIndex: delegateEvent.transactionIndex,
        supports: delegateSupports,
        stake: delegateStake,
      })

      delegatedVotes = []
    }
  }

  result.push(...(Object.values(votesMap) as VoteEvent[]))

  return result.sort((a, b) => {
    if (a.blockNumber !== b.blockNumber) {
      return b.blockNumber - a.blockNumber
    }
    return b.transactionIndex - a.transactionIndex
  })
}
