import memoize from 'lodash/memoize'

export const getIpfsBasePath = memoize(() => {
  let baseHref = document.querySelector('base')?.href || '/'
  if (baseHref[baseHref.length - 1] !== '/') baseHref += '/'
  return baseHref
})

export const prefixIpfsUrl = (url: string) => {
  return `${getIpfsBasePath().slice(0, -1)}${url}`
}
