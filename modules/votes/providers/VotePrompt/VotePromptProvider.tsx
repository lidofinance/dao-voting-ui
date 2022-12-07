import { debounce } from 'lodash'
import Router, { useRouter } from 'next/router'
import { useState, useEffect, useCallback, useMemo } from 'react'

import { votePromptContext } from './votePromptContext'
import * as urls from 'modules/network/utils/urls'

type Props = {
  children?: React.ReactNode
}

export function VotePromptProvider({ children }: Props) {
  const { asPath, query } = useRouter()

  const { voteId: urlVoteIdArr = [] } = query
  const [urlVoteId] = urlVoteIdArr as string[]
  const [voteId, setVoteIdState] = useState(urlVoteId || '')

  const changeRouteInstantly = useCallback((value: string) => {
    Router.push(urls.vote(value), undefined, {
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
      if (value) {
        setVoteIdState(value)
        changeRouteDebounced(value)
      } else {
        setVoteIdState(value)
        Router.push(urls.home)
      }
    },
    [setVoteIdState, changeRouteDebounced],
  )

  const clearVoteId = useCallback(() => {
    Router.push(urls.home)
  }, [])

  useEffect(() => {
    if (asPath === urls.voteIndex && voteId) {
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
