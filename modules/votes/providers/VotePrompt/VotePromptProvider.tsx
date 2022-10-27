import { debounce } from 'lodash'
import { useRouter } from 'next/router'
import { useState, useEffect, useCallback, useMemo } from 'react'

import { votePromptContext } from './votePromptContext'
import * as urls from 'modules/network/utils/urls'

type Props = {
  children?: React.ReactNode
}

export function VotePromptProvider({ children }: Props) {
  const router = useRouter()
  const { replace, asPath } = router
  const { voteId: urlVoteIdArr = [] } = router.query
  const [urlVoteId] = urlVoteIdArr as string[]
  console.log(urlVoteIdArr)
  const [voteId, setVoteIdState] = useState(urlVoteId || '')

  const changeRouteInstantly = useCallback((value: string) => {
    replace(urls.vote(value), undefined, {
      scroll: false,
      shallow: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const changeRouteDebounced = useMemo(
    () => debounce(changeRouteInstantly, 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
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
        changeRoute: changeRouteDebounced,
      }}
    >
      {children}
    </votePromptContext.Provider>
  )
}
