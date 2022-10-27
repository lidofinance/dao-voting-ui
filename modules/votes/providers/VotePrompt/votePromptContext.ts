import noop from 'lodash/noop'
import { createContext } from 'react'

type VotePromptContext = {
  voteId: string
  setVoteId: (voteId: string) => void
  clearVoteId: () => void
  changeRouteDebounced: (voteId: string) => void
  changeRouteInstantly: (voteId: string) => void
}

export const votePromptContext = createContext<VotePromptContext>({
  voteId: '',
  setVoteId: noop,
  clearVoteId: noop,
  changeRouteDebounced: noop,
  changeRouteInstantly: noop,
})
