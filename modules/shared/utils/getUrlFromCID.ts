// could be moved to env if needed
const defaultPrefix = 'https://cloudflare-ipfs.com/ipfs/'
const defaultSuffix = ''

const w3sPrefix = 'https://'
const w3sSuffix = '.ipfs.w3s.link'

export const getUrlFromCID = (cid: string) =>
  `${cid}`.startsWith('b')
    ? `${w3sPrefix}${cid}${w3sSuffix}`
    : `${defaultPrefix}${cid}${defaultSuffix}`
