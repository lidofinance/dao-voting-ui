import { AragonVotingAbi } from 'generated'
import { UnwrapPromise } from 'next/dist/lib/coalesced-function'

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
  NotVoted = 'NotVoted',
  VotedYay = 'VotedYay',
  VotedNay = 'VotedNay',
}
