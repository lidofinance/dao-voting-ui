import { Cache } from 'memory-cache'
import { CHAINS } from '@lido-sdk/constants'
import { fetcherStandard } from './fetcherStandard'
import {
  getEtherscanUrl,
  ETHERSCAN_API_URL,
  ETHERSCAN_CACHE_TTL,
} from 'modules/config/network'

const cache = new Cache<string, unknown>()

type Args = {
  chainId: CHAINS
  module: string
  action: string
  address: string
  apiKey?: string
}

export async function fetcherEtherscan<T>({
  chainId,
  module,
  action,
  address,
  apiKey,
}: Args) {
  const isProxy = !Boolean(apiKey)

  const queryParams = [
    `module=${module}`,
    `action=${action}`,
    `address=${address}`,
    isProxy && `chainId=${chainId}`,
    !isProxy && `apikey=${apiKey}`,
  ].filter(Boolean)

  const urlBase = isProxy ? ETHERSCAN_API_URL : getEtherscanUrl(chainId)
  const url = `${urlBase}?${queryParams.join('&')}`

  const cached = cache.get(url)
  if (cached) return cached as T
  const { result } = await fetcherStandard<{ result: T }>(url, {
    method: 'POST',
  })
  cache.put(url, result, ETHERSCAN_CACHE_TTL)
  return result
}
