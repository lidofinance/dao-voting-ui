import { useEffect } from 'react'
import { useConfig } from 'modules/config/hooks/useConfig'
import { usePrefixedReplace } from 'modules/network/hooks/usePrefixedHistory'
import * as urls from 'modules/network/utils/urls'

export default function HomePage() {
  const { ipfsMode } = useConfig()
  const replace = usePrefixedReplace()

  useEffect(() => {
    replace(urls.voteIndex)
  }, [replace, ipfsMode])

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
