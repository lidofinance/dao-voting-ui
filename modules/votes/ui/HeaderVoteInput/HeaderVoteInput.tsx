import { useCallback } from 'react'
import { useVotePrompt } from 'modules/votes/providers/VotePrompt'

import {
  Input,
  Wrap,
  SearchIconWrap,
  ClearIconWrap,
} from './HeaderVoteInputStyle'
import SearchIconSVG from './icons/search.com.svg.react'
import ClearIconSVG from 'assets/clear.com.svg.react'

export function HeaderVoteInput() {
  const { setVoteId, voteId, clearVoteId, changeRoute } = useVotePrompt()

  const handleChangeVoteId = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setVoteId(e.target.value)
    },
    [setVoteId],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        changeRoute(voteId)
      }
    },
    [changeRoute, voteId],
  )

  return (
    <Wrap>
      <Input
        name="voteId"
        value={voteId}
        placeholder="DAO Vote #"
        onChange={handleChangeVoteId}
        onKeyDown={handleKeyDown}
      />
      <SearchIconWrap>
        <SearchIconSVG />
      </SearchIconWrap>
      {voteId && (
        <ClearIconWrap onClick={clearVoteId}>
          <ClearIconSVG />
        </ClearIconWrap>
      )}
    </Wrap>
  )
}
