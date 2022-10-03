import { debounce } from 'lodash'
import { useMemo, useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'

import {
  Input,
  Wrap,
  SearchIconWrap,
  ClearIconWrap,
} from './HeaderVoteInputStyle'
import SearchIconSVG from './icons/search.com.svg.react'
import ClearIconSVG from 'assets/clear.com.svg.react'

import * as urls from 'modules/network/utils/urls'

export function HeaderVoteInput() {
  const router = useRouter()
  const { replace } = router
  const { voteId: urlVoteId = [] } = router.query
  const [voteId] = urlVoteId as string[]
  const [inputValue, setValue] = useState(voteId || '')

  const handleClear = useCallback(() => {
    setValue('')
  }, [])

  const changeRoute = useMemo(() => {
    return debounce((value: string) => {
      replace(urls.vote(value), undefined, {
        scroll: false,
        shallow: true,
      })
    }, 500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    changeRoute(inputValue)
  }, [inputValue, changeRoute])

  const handleChangeVoteId = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
    },
    [],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        changeRoute(inputValue)
      }
    },
    [changeRoute, inputValue],
  )

  return (
    <Wrap>
      <Input
        name="voteId"
        value={inputValue}
        defaultValue={voteId}
        placeholder="DAO Vote #"
        onChange={handleChangeVoteId}
        onKeyDown={handleKeyDown}
      />
      <SearchIconWrap>
        <SearchIconSVG />
      </SearchIconWrap>
      {inputValue && (
        <ClearIconWrap onClick={handleClear}>
          <ClearIconSVG />
        </ClearIconWrap>
      )}
    </Wrap>
  )
}
