import { VoteStatus } from '../types'

const VOTE_STATUS_TEXTS = {
  [VoteStatus.ActiveMain]: 'Active — Main Phase',
  [VoteStatus.ActiveObjection]: 'Active — Objection phase',
  [VoteStatus.Pending]: 'Passed',
  [VoteStatus.Executed]: 'Passed (Enacted)',
  [VoteStatus.Rejected]: 'Rejected',
}

export const getVoteStatusText = (s: VoteStatus) => VOTE_STATUS_TEXTS[s]
