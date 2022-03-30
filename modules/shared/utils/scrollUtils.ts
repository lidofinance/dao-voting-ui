import { isClientSide } from 'modules/shared/utils/isClientSide'

export const SCROLL_STORAGE_PREFIX = 'saved-scroll-'
export const HTML_LOCK_CLASS = 'html-scroll-lock'
export const BODY_LOCK_CLASS = 'body-scroll-lock'

const isClient = isClientSide()

let lockersStack = 0
let scrollPosition = 0
let isScrollLocked = false
let preventScrollRestoring = false
const body = isClient ? document.body : null
const html = isClient ? document.documentElement : null

export const getScrollPosition = () => {
  if (!html || !body) return 0
  if (!isScrollLocked) {
    scrollPosition = window.pageYOffset || html.scrollTop || body.scrollTop || 0
  }
  return scrollPosition
}

export const setScrollPosition = (scroll: number) => {
  if (!html || !body) return
  if (isScrollLocked) {
    scrollPosition = scroll
    body.style.top = `-${scroll}px`
  } else {
    window.scrollTo(0, scroll)
  }
}

// Scroll Locker
export const lockScroll = () => {
  if (!html || !body) return
  if (++lockersStack > 1) return
  const scroll = getScrollPosition()
  isScrollLocked = true
  html.classList.add(HTML_LOCK_CLASS)
  body.classList.add(BODY_LOCK_CLASS)
  body.style.top = `-${scroll}px`
}

// Scroll Unlocker
export const unlockScroll = () => {
  if (!html || !body) return
  if (--lockersStack > 0) return
  html.classList.remove(HTML_LOCK_CLASS)
  body.classList.remove(BODY_LOCK_CLASS)
  body.style.top = ''
  const scroll = getScrollPosition()
  window.scrollTo(0, scroll)
  isScrollLocked = false
}

export const saveScrollHistory = () => {
  const key = JSON.stringify(window.history.state)
  sessionStorage.setItem(
    SCROLL_STORAGE_PREFIX + key,
    String(getScrollPosition()),
  )
}

export const preventNextScrollRestoring = () => (preventScrollRestoring = true)

export const restoreScrollHistory = () => {
  if (preventScrollRestoring) {
    preventScrollRestoring = false
    return
  }
  const key = JSON.stringify(window.history.state)
  const top = Number(sessionStorage.getItem(SCROLL_STORAGE_PREFIX + key) || 0)
  setScrollPosition(top)
}
