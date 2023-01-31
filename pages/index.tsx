import { useMemo, useEffect } from 'react'
import { useRouter } from 'next/router'
import { usePrefixedReplace } from 'modules/network/hooks/usePrefixedHistory'

import { VoteForm } from 'modules/votes/ui/VoteForm'
import { SettingsForm } from 'modules/config/ui/SettingsForm'
import { DashboardGrid } from 'modules/dashboard/ui/DashboardGrid'

import * as urls from 'modules/network/utils/urls'
import { IPFS_MODE } from 'modules/config'

function HomePageWithBackend() {
  return <DashboardGrid currentPage={1} />
}

/**
 * We are using single index.html endpoint
 * with hash-based routing in ipfs build mode.
 * It is necessary because ipfs infrastructure does not support
 * redirects to make dynamic routes workable.
 */

const IPFS_ROUTABLE_PAGES = ['dashboard', 'vote', 'settings']

function HomePageIpfs() {
  const router = useRouter()
  const { asPath } = router
  const replace = usePrefixedReplace()

  const parsedPath = useMemo(() => {
    const hashPath = asPath.split('#')[1]
    if (!hashPath) return []
    return hashPath.split('/').splice(1)
  }, [asPath])

  useEffect(() => {
    if (parsedPath[0] && !IPFS_ROUTABLE_PAGES.includes(parsedPath[0])) {
      replace(urls.home)
    }
  }, [replace, parsedPath])

  /**
   * TODO:
   * We can upgrade this routing algorithm with a `match` method
   * and router config if we will need more functionality
   * Example: https://v5.reactrouter.com/web/api/match
   */
  switch (parsedPath[0]) {
    case 'dashboard': {
      return (
        <DashboardGrid
          currentPage={parsedPath[1] ? Number(parsedPath[1]) : 1}
        />
      )
    }

    case 'vote': {
      return <VoteForm voteId={parsedPath[1]} />
    }

    case 'settings': {
      return <SettingsForm />
    }

    default: {
      return <DashboardGrid currentPage={1} />
    }
  }
}

const HomePage = IPFS_MODE ? HomePageIpfs : HomePageWithBackend

export default HomePage

// #!if IPFS_MODE !== "true"
// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = async () => {
  return {
    props: {},
  }
}
// #!endif
