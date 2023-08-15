import ms from 'ms'
import { CHAINS } from '@lido-sdk/constants'
import { parseChainId, getChainName } from 'modules/blockChain/chains'

export const ETHERSCAN_API_URL = '/api/etherscan'
export const ETHERSCAN_CACHE_TTL = ms('1h')
export const IPFS_CACHE_TTL = ms('4h') // could be ∞ but better to reload

// could be moved to env if needed
const defaultPrefix = 'https://cloudflare-ipfs.com/ipfs/'
const defaultSuffix = ''

const w3sPrefix = 'https://'
const w3sSuffix = '.ipfs.w3s.link'

export const getRpcUrlDefault = (chainId: CHAINS) => {
  const BASE_URL = typeof window === 'undefined' ? '' : window.location.origin
  return `${BASE_URL}/api/rpc?chainId=${parseChainId(chainId)}`
}

export function getEtherscanUrl(chainId: CHAINS) {
  const chainName = getChainName(chainId!).toLowerCase()
  return chainId === CHAINS.Mainnet
    ? 'https://api.etherscan.io/api'
    : `https://api-${chainName}.etherscan.io/api`
}

export const getExternalUrlFromCID = (cid: string) =>
  `${cid}`.match(/^b/i)
    ? `${w3sPrefix}${cid}${w3sSuffix}`
    : `${defaultPrefix}${cid}${defaultSuffix}`

export const getLidoDescUrlFromCID = (cid: string) => {
  const BASE_URL = typeof window === 'undefined' ? '' : window.location.origin
  return `${BASE_URL}/api/ipfs/${cid}`
}
