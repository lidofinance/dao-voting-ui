import { debounce } from 'lodash'
import Router, { useRouter } from 'next/router'
import { useState, useEffect, useCallback, useMemo } from 'react'

import { votePromptContext } from './votePromptContext'
import * as urls from 'modules/network/utils/urls'

type Props = {
  children?: React.ReactNode
}

export function VotePromptProvider({ children }: Props) {
  const { query } = useRouter()
  const { voteId: urlVoteId = '' } = query as { voteId: string }
  const [voteId, setVoteIdState] = useState(urlVoteId || '')

  const changeRouteInstantly = useCallback((value: string) => {
    const _voteId = Router.query.voteId
    if (_voteId === value || (!_voteId && !value)) return
    Router.push(value ? urls.vote(value) : urls.home, undefined, {
      scroll: false,
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
    setVoteId('')
  }, [setVoteId])

  useEffect(() => {
    setVoteIdState(urlVoteId || '')
  }, [urlVoteId])

  const contextValue = useMemo(
    () => ({
      voteId,
      setVoteId,
      clearVoteId,
      changeRouteDebounced,
      changeRouteInstantly,
    }),
    [
      voteId,
      setVoteId,
      clearVoteId,
      changeRouteDebounced,
      changeRouteInstantly,
    ],
  )

  return (
    <votePromptContext.Provider value={contextValue}>
      {children}
    </votePromptContext.Provider>
  )
}
