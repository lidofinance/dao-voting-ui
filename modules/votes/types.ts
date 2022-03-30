import { VotingAbi } from 'generated'
import { UnwrapPromise } from 'next/dist/lib/coalesced-function'

export type Vote = UnwrapPromise<ReturnType<VotingAbi['getVote']>>
