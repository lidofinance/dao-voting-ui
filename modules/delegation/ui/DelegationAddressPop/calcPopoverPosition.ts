import { minmax } from 'modules/shared/utils/minmax'

export function calcPopoverPosition(wrapEl: HTMLElement, popEl: HTMLElement) {
  const wrapBox = wrapEl.getBoundingClientRect()
  const popBox = popEl.getBoundingClientRect()

  const left = wrapBox.left + wrapBox.width / 2 - popBox.width / 2
  const top = wrapBox.top + wrapBox.height / 2 - popBox.height / 2

  return {
    left: minmax(10, left, window.innerWidth - popBox.width - 10),
    top: minmax(10, top, window.innerHeight - popBox.height - 10),
  }
}
