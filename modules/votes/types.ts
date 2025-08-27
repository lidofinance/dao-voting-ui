import { BigNumber } from 'ethers'
import { AragonVotingAbi } from 'generated'
import { UnwrapPromise } from 'next/dist/lib/coalesced-function'
import type {
  ExecuteVoteEvent,
  ExecuteVoteEventObject,
} from 'generated/AragonVotingAbi'

export type Vote = UnwrapPromise<ReturnType<AragonVotingAbi['getVote']>>

export type VoteMode = 'yay' | 'nay' | 'enact'

export enum VoteStatus {
  ActiveMain = 'ActiveMain',
  ActiveObjection = 'ActiveObjection',
  Executed = 'Executed',
  Pending = 'Pending',
  Passed = 'Passed',
  Rejected = 'Rejected',
}

export enum VoterState {
  Absent,
  Yea,
  Nay,
  DelegateYea,
  DelegateNay,
}

/**
 * VotePhase.Main if one can vote 'yes' or 'no',
 * VotePhase.Objection if one can vote only 'no' or
 * VotePhase.Closed if no votes are accepted
 */

export enum VotePhase {
  Main,
  Objection,
  Closed,
}

export type VoteInfo = {
  stake: BigNumber
  voter: string
  supports: boolean
}

export type VoteMetadata = {
  blockNumber: number
  transactionIndex: number
}

export type VoteEvent = VoteInfo & {
  delegatedVotes?: VoteInfo[]
}

export type EventExecuteVote = {
  event: ExecuteVoteEvent
  decoded: ExecuteVoteEventObject
  executedAt: number | undefined
} | null
