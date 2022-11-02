import { IPFS_MODE } from 'modules/config'

const prefixUrl = (url: string) => (IPFS_MODE ? `/#${url}` : url)

export const home = prefixUrl('/')
export const voteIndex = prefixUrl('/vote')
export const vote = (voteId: string | number) => prefixUrl(`/vote/${voteId}`)
export const settings = prefixUrl('/settings')
