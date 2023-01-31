import { useCallback } from 'react'
import Router, { NextRouter } from 'next/router'

import { prefixIpfsUrl } from '../utils/getIpfsBasePath'

type Args = Parameters<NextRouter['push']>

export function usePrefixedPush() {
  return useCallback((url: string, as?: Args[1], options?: Args[2]) => {
    return Router.push(prefixIpfsUrl(url), as, options)
  }, [])
}

export function usePrefixedReplace() {
  return useCallback((url: string, as?: Args[1], options?: Args[2]) => {
    return Router.replace(prefixIpfsUrl(url), as, options)
  }, [])
}
