import { DELEGATORS_PAGE_SIZE } from '../constants'
import { useDelegators } from './useDelegators'

export function useDelegatorsPaginatedList(pageNumber: number) {
  const { data, initialLoading, loading } = useDelegators()
  if (pageNumber < 0 || !data?.list) {
    return { data: [], initialLoading, loading }
  }
  const delegators = data.list
  delegators.sort((prev, next) => (prev.balance.gt(next.balance) ? -1 : 1))

  const delegatorsPage = delegators.slice(
    pageNumber * DELEGATORS_PAGE_SIZE,
    (pageNumber + 1) * DELEGATORS_PAGE_SIZE,
  )
  return {
    data: delegatorsPage,
    initialLoading,
    loading,
  }
}
