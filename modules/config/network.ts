import ms from 'ms'
import { CHAINS } from '@lido-sdk/constants'
import { parseChainId } from 'modules/blockChain/chains'

export const ETHERSCAN_API_URL = '/api/etherscan'
export const ETHERSCAN_CACHE_TTL = ms('1h')
export const ETHERSCAN_REMOTE_API_URL = 'https://api.etherscan.io/v2/api'

// could be moved to env if needed
const defaultPrefix = 'https://cloudflare-ipfs.com/ipfs/'
const defaultSuffix = ''

const w3sPrefix = 'https://'
const w3sSuffix = '.ipfs.w3s.link'

export const getRpcUrlDefault = (chainId: CHAINS) => {
  const BASE_URL = typeof window === 'undefined' ? '' : window.location.origin
  return `${BASE_URL}/api/rpc?chainId=${parseChainId(chainId)}`
}

export const getIpfsUrl = (cid: string) =>
  `${cid}`.match(/^b/i)
    ? `${w3sPrefix}${cid}${w3sSuffix}`
    : `${defaultPrefix}${cid}${defaultSuffix}`
