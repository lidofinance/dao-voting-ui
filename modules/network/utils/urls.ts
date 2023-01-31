import { IPFS_MODE } from 'modules/config'

const prefixUrl = (url: string) => (IPFS_MODE ? `/#${url}` : url)

export const home = prefixUrl('/')
export const dashboardIndex = prefixUrl('/dashboard')
export const dashboardPage = (page: string | number) =>
  prefixUrl(`/dashboard/${page}`)
export const voteIndex = prefixUrl('/vote')
export const vote = (voteId: string | number) => prefixUrl(`/vote/${voteId}`)
export const settings = prefixUrl('/settings')
