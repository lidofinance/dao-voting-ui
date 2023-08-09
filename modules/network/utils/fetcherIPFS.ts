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
type IFailedResponse = { ok: false }
export const fetcherIPFS: FetcherIPFS = async (
  cid,
  params = DEFAULT_PARAMS,
) => {
  const response = await Promise.race([
    fetch(getUrlFromCID(cid), params),
    new Promise<IFailedResponse>(resolve =>
      setTimeout(() => resolve({ ok: false }), 5000),
    ),
  ])

  if (!response.ok) {
    throw new Error('An error occurred while fetching the data.')
  }

  const data = await response.text()
  return data
}
