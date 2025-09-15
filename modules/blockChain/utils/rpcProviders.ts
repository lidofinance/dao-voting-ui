import {
  JsonRpcProvider,
  JsonRpcBatchProvider,
  StaticJsonRpcProvider,
  Networkish,
} from '@ethersproject/providers'
import { StaticJsonRpcBatchProvider } from './StaticJsonRpcBatchProvider'

/**
 * Local copy of the same file from "@lido-sdk"
 */

type ProviderType =
  | JsonRpcProvider
  | JsonRpcBatchProvider
  | StaticJsonRpcProvider
  | StaticJsonRpcBatchProvider

const createProviderGetter = <T extends ProviderType>(
  Provider: new (url: string, network: Networkish) => T,
) => {
  const cache = new Map<string, T>()

  return (
    chainId: number,
    url: string,
    cacheSeed = 0,
    pollingInterval?: number,
  ): T => {
    const cacheKey = `${chainId}-${cacheSeed}-${url}`
    let provider = cache.get(cacheKey)

    if (!provider) {
      provider = new Provider(url, chainId)
      cache.set(cacheKey, provider)
    }

    if (pollingInterval !== undefined) {
      provider.pollingInterval = pollingInterval
    }

    return provider
  }
}

export const getRpcProvider = createProviderGetter(JsonRpcProvider)

export const getRpcBatchProvider = createProviderGetter(JsonRpcBatchProvider)

export const getStaticRpcProvider = createProviderGetter(StaticJsonRpcProvider)

export const getStaticRpcBatchProvider = createProviderGetter(
  StaticJsonRpcBatchProvider,
)
