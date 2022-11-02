import { useMemo, useEffect } from 'react'
import { useRouter } from 'next/router'
import { usePrefixedReplace } from 'modules/network/hooks/usePrefixedHistory'

import { VoteForm } from 'modules/votes/ui/VoteForm'
import { SettingsForm } from 'modules/config/ui/SettingsForm'

import * as urls from 'modules/network/utils/urls'

const ROUTABLE_PAGES = ['vote', 'settings']

export default function HomePage() {
  const router = useRouter()
  const { asPath } = router
  const replace = usePrefixedReplace()

  const parsedPath = useMemo(() => {
    const hashPath = asPath.split('#')[1]
    if (!hashPath) return []
    return hashPath.split('/').splice(1)
  }, [asPath])

  useEffect(() => {
    if (!parsedPath[0] || !ROUTABLE_PAGES.includes(parsedPath[0])) {
      replace(urls.voteIndex)
    }
  }, [replace, parsedPath])

  switch (parsedPath[0]) {
    case 'vote':
      return <VoteForm voteId={parsedPath[1]} />

    case 'settings':
      return <SettingsForm />

    default:
      return null
  }
}
