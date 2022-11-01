import { useContext } from 'react'

import { votePromptContext } from './votePromptContext'

export function useVotePrompt() {
  return useContext(votePromptContext)
}
