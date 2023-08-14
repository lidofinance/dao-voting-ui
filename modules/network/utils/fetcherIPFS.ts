import { getUrlFromCID } from 'modules/shared/utils/getUrlFromCID'

export const DEFAULT_PARAMS = {
  method: 'GET',
  headers: {
    'Content-type': 'text/plain',
    // 100kb max description filesize (about 50k words)
    range: 'bytes=0-100000',
  },
}

type FetcherIPFS = (cid: string, params?: RequestInit) => Promise<string>
export const fetcherIPFS: FetcherIPFS = async (
  cid,
  params = DEFAULT_PARAMS,
) => {
  const paramsWithTimeout = { ...params, signal: AbortSignal.timeout(8000) }
  const response = await fetch(getUrlFromCID(cid), paramsWithTimeout)

  if (!response.ok) {
    throw new Error('An error occurred while fetching the data.')
  }

  const data = await response.text()
  return data
}
