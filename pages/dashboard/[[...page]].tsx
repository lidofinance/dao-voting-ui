import { useEffect } from 'react'
import Router, { useRouter } from 'next/router'

import { DashboardGrid } from 'modules/dashboard/ui/DashboardGrid'
import * as urls from 'modules/network/utils/urls'

export default function AboutPage() {
  const router = useRouter()
  const { page: urlPage = [] } = router.query
  const [pageString] = urlPage as string[]
  const page = Number(pageString)

  useEffect(() => {
    if (Number.isNaN(page)) {
      Router.replace(urls.home)
    }
  }, [page])

  if (Number.isNaN(page)) {
    return null
  }

  return <DashboardGrid currentPage={page} />
}

// #!if IPFS_MODE !== "true"
// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = async () => {
  return {
    props: {},
  }
}
// #!endif
