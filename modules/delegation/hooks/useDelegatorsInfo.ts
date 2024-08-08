import { useDelegators } from './useDelegators'

export function useDelegatorsInfo() {
  const { data, initialLoading, loading } = useDelegators()

  return {
    data: {
      totalCount: data?.totalCount ?? 0,
      fetchedCount: data?.fetchedCount ?? 0,
      wealthyCount: data?.wealthyCount ?? 0,
      fetchedValue: data?.fetchedValue ?? 0,
    },
    loading,
    initialLoading,
  }
}
