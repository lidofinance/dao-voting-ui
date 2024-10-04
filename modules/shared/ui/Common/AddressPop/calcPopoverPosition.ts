import { minmax } from 'modules/shared/utils/minmax'

export function calcPopoverPosition(wrapEl: HTMLElement, popEl: HTMLElement) {
  const wrapBox = wrapEl.getBoundingClientRect()
  const popBox = popEl.getBoundingClientRect()

  // Check if we're inside a modal
  const isInModal = wrapEl.closest('[role="dialog"]') !== null

  if (isInModal && wrapEl.offsetParent instanceof HTMLElement) {
    let offsetParent: HTMLElement | null = wrapEl.offsetParent
    let offsetX = 0
    let offsetY = 0

    while (offsetParent) {
      offsetX += offsetParent.offsetLeft - offsetParent.scrollLeft
      offsetY += offsetParent.offsetTop - offsetParent.scrollTop
      offsetParent = offsetParent.offsetParent as HTMLElement | null
    }

    const left = wrapBox.left + wrapBox.width / 2 - popBox.width / 2 - offsetX
    const top = wrapBox.top + wrapBox.height / 2 - popBox.height / 2 - offsetY

    const modalWidth = wrapEl.offsetParent.clientWidth
    const modalHeight = wrapEl.offsetParent.clientHeight

    return {
      left: minmax(10, left, modalWidth - popBox.width - 10),
      top: minmax(10, top, modalHeight - popBox.height - 10),
    }
  }

  const left = wrapBox.left + wrapBox.width / 2 - popBox.width / 2 - 100
  const top = wrapBox.top + wrapBox.height / 2 - popBox.height / 2

  return {
    left: minmax(10, left, window.innerWidth - popBox.width - 10),
    top: minmax(10, top, window.innerHeight - popBox.height - 10),
  }
}
