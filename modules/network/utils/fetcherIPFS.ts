import Hash from 'ipfs-only-hash'
import { getIpfsUrl } from 'modules/config/network'

export const DEFAULT_PARAMS = {
  method: 'GET',
  headers: {
    'Content-type': 'text/plain',
    // 100kb max description filesize (about 50k words)
    range: 'bytes=0-100000',
  },
}

const IPFS_TIMEOUT = 8000

type FetcherIPFS = (cid: string, params?: RequestInit) => Promise<string>
export const fetcherIPFS: FetcherIPFS = async (
  cid,
  params = DEFAULT_PARAMS,
) => {
  const paramsWithTimeout = {
    ...params,
    signal: AbortSignal.timeout(IPFS_TIMEOUT),
  }
  const response = await fetch(getIpfsUrl(cid), paramsWithTimeout)

  if (!response.ok) {
    throw new Error('An error occurred while fetching the data.')
  }

  const text = await response.text()

  const [hash, hashBOM] = await Promise.all([
    Hash.of(text, { cidVersion: 1, rawLeaves: true }),
    Hash.of('\ufeff' + text, { cidVersion: 1, rawLeaves: true }),
  ])

  if (![hash, hashBOM].includes(cid)) {
    throw new Error('An error occurred while validate fetched the data.')
  }

  return text
}
