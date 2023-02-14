import { SWRConfiguration } from 'swr'
import { useSWR } from 'modules/network/hooks/useSwr'
import type { FilterAsyncMethods } from '@lido-sdk/react/dist/esm/hooks/types'
import {
  AsyncMethodParameters,
  AsyncMethodReturns,
} from 'modules/types/filter-async-methods'

export function useContractSwr<
  C,
  M extends FilterAsyncMethods<C>,
  R extends AsyncMethodReturns<C, M>,
>(
  contract: C,
  method: M | null | false,
  params: AsyncMethodParameters<C, M>,
  config?: SWRConfiguration<R>,
) {
  const shouldFetch = method !== null && method !== false
  const cacheKey = (contract as any).address
  const args = [cacheKey, method, ...params]

  return useSWR<R>(
    shouldFetch ? args : null,
    () =>
      method !== null && method !== false
        ? (contract[method] as any)(...params)
        : null,
    config,
  )
}
