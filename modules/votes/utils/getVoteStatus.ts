import { Vote, VoteStatus } from 'modules/votes/types'
import { isVoteEnactable } from 'modules/votes/utils/isVoteEnactable'

export function getVoteStatus(
  vote: Vote | undefined | null,
  canExecute: boolean | undefined | null,
) {
  if (!vote) return null

  const { open, executed, phase } = vote

  if (!open) {
    if (executed) return VoteStatus.Executed
    if (canExecute && !isVoteEnactable(vote)) return VoteStatus.Passed
    if (canExecute && isVoteEnactable(vote)) return VoteStatus.Pending
    return VoteStatus.Rejected
  }

  if (!executed && phase === 1) {
    return VoteStatus.ActiveObjection
  }

  return VoteStatus.ActiveMain
}
