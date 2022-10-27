import { debounce } from 'lodash'
import { useRouter } from 'next/router'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'

import { votePromptContext } from './votePromptContext'
import * as urls from 'modules/network/utils/urls'

type Props = {
  children?: React.ReactNode
}

export function VotePromptProvider({ children }: Props) {
  const router = useRouter()
  const { replace, asPath } = router
  const replaceRef = useRef(replace)

  const { voteId: urlVoteIdArr = [] } = router.query
  const [urlVoteId] = urlVoteIdArr as string[]
  const [voteId, setVoteIdState] = useState(urlVoteId || '')

  if (replaceRef.current !== replace) replaceRef.current = replace

  const changeRouteInstantly = useCallback((value: string) => {
    replaceRef.current(urls.vote(value), undefined, {
      scroll: false,
      shallow: true,
    })
  }, [])

  const changeRouteDebounced = useMemo(
    () => debounce(changeRouteInstantly, 500),
    [changeRouteInstantly],
  )

  const setVoteId = useCallback(
    (value: string) => {
      setVoteIdState(value)
      changeRouteDebounced(value)
    },
    [setVoteIdState, changeRouteDebounced],
  )

  const clearVoteId = useCallback(() => {
    setVoteIdState('')
    changeRouteInstantly('')
  }, [changeRouteInstantly])

  useEffect(() => {
    if (asPath === '/vote' && voteId) {
      changeRouteDebounced(voteId)
    }
  }, [asPath, voteId, changeRouteDebounced])

  return (
    <votePromptContext.Provider
      value={{
        voteId: voteId,
        setVoteId,
        clearVoteId,
        changeRouteDebounced,
        changeRouteInstantly,
      }}
    >
      {children}
    </votePromptContext.Provider>
  )
}
