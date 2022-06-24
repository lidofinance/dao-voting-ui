import { Vote } from '../types'

const EMPTY_SCRIPT = '0x00000001'

export function isVoteEnactable(vote: Vote) {
  return vote.script && vote.script !== EMPTY_SCRIPT
}
