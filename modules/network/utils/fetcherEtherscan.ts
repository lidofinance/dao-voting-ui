import { Cache } from 'memory-cache'
import { CHAINS } from '@lido-sdk/constants'
import { ETHERSCAN_API_URL, ETHERSCAN_CACHE_TTL } from 'modules/config/network'
import { fetcherStandard } from './fetcherStandard'

const cache = new Cache<string, unknown>()

export async function fetcherEtherscan<T>(
  chainId: CHAINS,
  contractAddress: string,
) {
  const url = `${ETHERSCAN_API_URL}?chainId=${chainId}&address=${contractAddress}`
  const cached = cache.get(url)
  if (cached) return cached as T
  const res = await fetcherStandard<T>(url)
  cache.put(url, res, ETHERSCAN_CACHE_TTL)
  return res
}
