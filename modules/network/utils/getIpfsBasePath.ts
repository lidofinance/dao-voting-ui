import memoize from 'lodash/memoize'

export const getIpfsBasePath = memoize(() => {
  return document.querySelector('base')?.href || ''
})

export const prefixUrl = (url: string) => {
  return `${getIpfsBasePath()}/${url}`.replace(/([^:]\/)\/+/g, '$1')
}
