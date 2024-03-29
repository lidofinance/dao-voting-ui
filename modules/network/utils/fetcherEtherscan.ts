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
  useCache?: boolean
}

export async function fetcherEtherscan<T>({
  chainId,
  module,
  action,
  address,
  apiKey,
  useCache = true,
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

  if (useCache) {
    const cached = cache.get(url)
    if (cached) return cached as T
  }

  const { status, result } = await fetcherStandard<{
    status: number
    result: T
  }>(url, {
    method: 'POST',
  })

  if (Number(status) === 0) {
    throw new Error(String(result))
  }

  if (useCache) {
    cache.put(url, result, ETHERSCAN_CACHE_TTL)
  }

  return result
}
