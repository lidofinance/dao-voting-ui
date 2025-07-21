import type { AragonVotingAbi } from 'generated'
import { BigNumber } from 'ethers'
import { VoteEvent, VoteInfo, VoteMetadata } from '../types'

const isVoteMoreRecentThan = (
  newVote: VoteMetadata,
  existingVote: VoteMetadata | undefined,
): boolean => {
  if (!existingVote) {
    return true
  }

  if (newVote.blockNumber > existingVote.blockNumber) {
    return true
  }

  if (newVote.blockNumber === existingVote.blockNumber) {
    return newVote.transactionIndex > existingVote.transactionIndex
  }

  return false
}

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

  // Voter address -> vote info & metadata
  const votesMap: Record<string, (VoteInfo & VoteMetadata) | undefined> = {}

  for (const event of castVoteEvents) {
    const key = event.args.voter.toLowerCase()

    if (isVoteMoreRecentThan(event, votesMap[key])) {
      votesMap[key] = {
        blockNumber: event.blockNumber,
        transactionIndex: event.transactionIndex,
        voter: event.args.voter,
        supports: event.args.supports,
        stake: event.args.stake,
      }
    }
  }

  const delegateEvents = await contractVoting.queryFilter(
    contractVoting.filters.AttemptCastVoteAsDelegate(voteIdNum),
    fromBlock,
  )

  // ${delegateAddress}-${supports} -> VoteEvent
  const delegatedVotesMap: Record<string, VoteEvent | undefined> = {}

  for (const delegateEvent of delegateEvents) {
    const nestedVotes: VoteEvent[] = []

    for (const voter of delegateEvent.args.voters) {
      const key = voter.toLowerCase()
      const voteEvent = votesMap[key]

      if (!voteEvent) {
        continue
      }

      if (
        voteEvent.blockNumber === delegateEvent.blockNumber &&
        voteEvent.transactionIndex === delegateEvent.transactionIndex
      ) {
        // If there is a vote happening at the same block and transaction index,
        // we can consider it as a delegated vote.
        nestedVotes.push({
          stake: voteEvent.stake,
          voter: voteEvent.voter,
          supports: voteEvent.supports,
        })

        delete votesMap[key]
      }
    }

    if (nestedVotes.length > 0) {
      const delegateSupports = nestedVotes[0].supports
      const delegateKey = `${delegateEvent.args.delegate.toLowerCase()}-${delegateSupports}`
      const existingDelegatedVote = delegatedVotesMap[delegateKey]

      let delegatedVotes = nestedVotes
      // If there is an existing delegated vote with the same `supports` value,
      // we need to merge two delegated votes.
      if (existingDelegatedVote) {
        const nestedVotesMap = new Map<string, VoteEvent>()

        ;[
          ...(existingDelegatedVote.delegatedVotes ?? []),
          ...nestedVotes,
        ].forEach(v => {
          nestedVotesMap.set(v.voter.toLowerCase(), v)
        })

        delegatedVotes = Array.from(nestedVotesMap.values())
      }

      const delegatedStake = delegatedVotes.reduce(
        (acc, v) => acc.add(v.stake),
        BigNumber.from(0),
      )

      const sortedVotes = delegatedVotes.sort((a, b) => {
        return a.stake.gt(b.stake) ? -1 : 1
      })

      delegatedVotesMap[delegateKey] = {
        voter: delegateEvent.args.delegate,
        delegatedVotes: sortedVotes,
        supports: delegateSupports,
        stake: delegatedStake,
      }
    }
  }

  return [
    ...(Object.values(votesMap) as VoteEvent[]),
    ...(Object.values(delegatedVotesMap) as VoteEvent[]),
  ].sort((a, b) => {
    return a.stake.gt(b.stake) ? -1 : 1
  })
}
