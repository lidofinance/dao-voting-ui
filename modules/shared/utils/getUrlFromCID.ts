// could be moved to env if needed
const CIDv0Prefix = 'https://ipfs.io/ipfs/'
const CIDv0Suffix = ''

const CIDv1Prefix = 'https://'
const CIDv1Suffix = '.ipfs.w3s.link'

export const getUrlFromCID = (cid: string) =>
  `${cid}`.startsWith('Qm')
    ? `${CIDv0Prefix}${cid}${CIDv0Suffix}`
    : `${CIDv1Prefix}${cid}${CIDv1Suffix}`
