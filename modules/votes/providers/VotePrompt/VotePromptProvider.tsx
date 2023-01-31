import { debounce } from 'lodash'
import { useRouter } from 'next/router'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { usePrefixedPush } from 'modules/network/hooks/usePrefixedHistory'

import { votePromptContext } from './votePromptContext'
import * as urls from 'modules/network/utils/urls'

type Props = {
  children?: React.ReactNode
}

export function VotePromptProvider({ children }: Props) {
  const push = usePrefixedPush()
  const { asPath, query } = useRouter()

  const { voteId: urlVoteIdArr = [] } = query
  const [urlVoteId] = urlVoteIdArr as string[]
  const [voteId, setVoteIdState] = useState(urlVoteId || '')

  const changeRouteInstantly = useCallback(
    (value: string) => {
      push(urls.vote(value), undefined, {
        scroll: false,
        shallow: true,
      })
    },
    [push],
  )

  const changeRouteDebounced = useMemo(
    () => debounce(changeRouteInstantly, 500),
    [changeRouteInstantly],
  )

  const setVoteId = useCallback(
    (value: string) => {
      if (value) {
        setVoteIdState(value)
        changeRouteDebounced(value)
      } else {
        setVoteIdState(value)
        push(urls.home)
      }
    },
    [setVoteIdState, changeRouteDebounced, push],
  )

  const clearVoteId = useCallback(() => {
    push(urls.home)
  }, [push])

  useEffect(() => {
    if (asPath.endsWith(urls.voteIndex) && voteId) {
      changeRouteDebounced(voteId)
    }
  }, [asPath, voteId, changeRouteDebounced])

  useEffect(() => {
    setVoteIdState(urlVoteId || '')
  }, [urlVoteId])

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
