import { SWRConfiguration } from 'swr'
import { useSWR } from 'modules/network/hooks/useSwr'
import type {
  FilterAsyncMethods,
  UnpackedPromise,
} from '@lido-sdk/react/dist/esm/hooks/types'

export function useContractSwr<
  C,
  M extends FilterAsyncMethods<C>,
  R extends UnpackedPromise<ReturnType<C[M]>>,
>(
  contract: C,
  method: M | null | false,
  params: Parameters<C[M]>,
  config?: SWRConfiguration<R>,
) {
  const shouldFetch = method !== null && method !== false
  const cacheKey = (contract as any).address
  const args = [cacheKey, method, ...params]

  return useSWR<R>(
    shouldFetch ? args : null,
    () =>
      method !== null && method !== false ? contract[method](...params) : null,
    config,
  )
}
