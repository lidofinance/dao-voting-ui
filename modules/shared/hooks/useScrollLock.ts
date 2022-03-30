import { useEffect } from 'react'
import { lockScroll, unlockScroll } from 'modules/shared/utils/scrollUtils'

export function useScrollLock(isLocked = true) {
  useEffect(() => {
    if (!isLocked) return
    lockScroll()
    return unlockScroll
  }, [isLocked])
}
