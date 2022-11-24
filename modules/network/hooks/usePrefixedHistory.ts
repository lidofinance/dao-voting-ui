import { useCallback } from 'react'
import { useRouter, NextRouter } from 'next/router'

import { prefixIpfsUrl } from '../utils/getIpfsBasePath'

type Args = Parameters<NextRouter['push']>

export function usePrefixedPush() {
  const router = useRouter()
  return useCallback(
    (url: string, as?: Args[1], options?: Args[2]) => {
      return router.push(prefixIpfsUrl(url), as, options)
    },
    [router],
  )
}

export function usePrefixedReplace() {
  const router = useRouter()
  return useCallback(
    (url: string, as?: Args[1], options?: Args[2]) => {
      return router.replace(prefixIpfsUrl(url), as, options)
    },
    [router],
  )
}
