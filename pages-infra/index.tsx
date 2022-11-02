import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useConfig } from 'modules/config/hooks/useConfig'
import * as urls from 'modules/network/utils/urls'

export default function HomePage() {
  const router = useRouter()
  const { ipfsMode } = useConfig()

  useEffect(() => {
    router.replace(urls.voteIndex)
  }, [router, ipfsMode])

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
