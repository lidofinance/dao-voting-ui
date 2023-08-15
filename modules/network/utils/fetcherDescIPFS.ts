import { getLidoDescUrlFromCID } from 'modules/config/network'

export const DEFAULT_PARAMS = {
  method: 'GET',
  headers: {
    'Content-type': 'text/plain',
  },
}

type FetcherDescIPFS = (cid: string, params?: RequestInit) => Promise<string>
export const fetcherDescIPFS: FetcherDescIPFS = async (
  cid,
  params = DEFAULT_PARAMS,
) => {
  const response = await fetch(getLidoDescUrlFromCID(cid), params)

  if (!response.ok) {
    throw new Error('An error occurred while fetching the data.')
  }

  const data = await response.text()
  return data
}
