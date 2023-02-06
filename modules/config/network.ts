import ms from 'ms'
import { CHAINS } from '@lido-sdk/constants'
import { parseChainId, getChainName } from 'modules/blockChain/chains'

export const ETHERSCAN_API_URL = '/api/etherscan'
export const ETHERSCAN_CACHE_TTL = ms('1h')

export const getRpcUrlDefault = (chainId: CHAINS) =>
  `/api/rpc?chainId=${parseChainId(chainId)}`

export function getEtherscanUrl(chainId: CHAINS) {
  const chainName = getChainName(chainId!).toLowerCase()
  return chainId === CHAINS.Mainnet
    ? 'https://api.etherscan.io/api'
    : `https://api-${chainName}.etherscan.io/api`
}
