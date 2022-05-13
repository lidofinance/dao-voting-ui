import { VotingAbi } from 'generated'
import { UnwrapPromise } from 'next/dist/lib/coalesced-function'

export type Vote = UnwrapPromise<ReturnType<VotingAbi['getVote']>>

export type VoteMode = 'yay' | 'nay'

export enum VoteStatus {
  Active = 'Active',
  Executed = 'Executed',
  Pending = 'Pending',
  Rejected = 'Rejected',
}

export enum VoterState {
  NotVoted = 'NotVoted',
  VotedYay = 'VotedYay',
  VotedNay = 'VotedNay',
}
