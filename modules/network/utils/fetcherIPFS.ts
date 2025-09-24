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

  const textRaw = await response.text()
  const text = textRaw.replaceAll('\x00', '')

  // issue with IPFS gateway for vote 167
  const preparedText = text.replaceAll(`\x00`, '')

  const [hash, hashBOM] = await Promise.all([
    Hash.of(preparedText, { cidVersion: 1, rawLeaves: true }),
    Hash.of('\ufeff' + preparedText, { cidVersion: 1, rawLeaves: true }),
  ])

  if (![hash, hashBOM].includes(cid)) {
    throw new Error('An error occurred while validate fetched the data.')
  }

  return preparedText
}
