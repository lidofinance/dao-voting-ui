import { useEffect } from 'react'
import { useRouter } from 'next/router'
import * as urls from 'modules/network/utils/urls'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    router.replace(urls.voteIndex)
  }, [router])

  return null
}

// #!if IPFS_MODE !== "true"
// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = async () => {
  return {
    props: {},
  }
}
// #!endif
