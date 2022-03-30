export const DEFAULT_PARAMS = {
  method: 'GET',
  headers: {
    'Content-type': 'application/json',
  },
}

type FetcherStandard = <T extends unknown>(
  url: string,
  params?: RequestInit,
) => Promise<T>

export const fetcherStandard: FetcherStandard = async (
  url,
  params = DEFAULT_PARAMS,
) => {
  const response = await fetch(url, params)

  if (!response.ok) {
    throw new Error('An error occurred while fetching the data.')
  }

  const data = await response.json()
  return data
}
