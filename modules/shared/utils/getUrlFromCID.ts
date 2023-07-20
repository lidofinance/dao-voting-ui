// could be moved to env if needed
const CIDPrefix = 'https://'
const CIDSuffix = '.ipfs.w3s.link'

export const getUrlFromCID = (cid: string) => `${CIDPrefix}${cid}${CIDSuffix}`
