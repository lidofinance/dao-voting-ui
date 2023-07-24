import { useCallback } from 'react'
import { useVotePrompt } from 'modules/votes/providers/VotePrompt'

import { Input, SearchIconWrap, ClearIconWrap } from './HeaderVoteInputStyle'
import SearchIconSVG from './icons/search.com.svg.react'
import ClearIconSVG from 'assets/clear.com.svg.react'

export function HeaderVoteInput() {
  const { setVoteId, voteId, clearVoteId, changeRouteInstantly } =
    useVotePrompt()

  const handleChangeVoteId = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setVoteId(e.target.value)
    },
    [setVoteId],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        changeRouteInstantly(voteId)
      }
    },
    [changeRouteInstantly, voteId],
  )

  return (
    <Input
      name="voteId"
      value={voteId}
      placeholder="DAO Vote #"
      onChange={handleChangeVoteId}
      onKeyDown={handleKeyDown}
      fullwidth
      leftDecorator={
        <SearchIconWrap>
          <SearchIconSVG />
        </SearchIconWrap>
      }
      rightDecorator={
        voteId && (
          <ClearIconWrap onClick={clearVoteId}>
            <ClearIconSVG />
          </ClearIconWrap>
        )
      }
    />
  )
}
