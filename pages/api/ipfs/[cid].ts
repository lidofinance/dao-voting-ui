import ms from 'ms'
import { Cache } from 'memory-cache'
import type { NextApiRequest, NextApiResponse } from 'next'
import Hash from 'ipfs-only-hash'

import { logger } from 'modules/shared/utils/log'
import clone from 'just-clone'
import { IPFS_CACHE_TTL } from 'modules/config'
import { getExternalUrlFromCID } from 'modules/config/network'
import { DESC_CID } from 'modules/shared/utils/regexCID'

const cache = new Cache<string, unknown>()

const ABORT_TIMEOUT = ms('8s')

export default async function ipfs(req: NextApiRequest, res: NextApiResponse) {
  const cid = `${req.query.cid}` // can't be an array bc come from dir structure

  // supports only CIDv1 in base32
  const requestInfo = {
    type: 'API request',
    path: 'ipfs',
    query: clone(req.query),
    method: req.method,
    stage: 'INCOMING',
  }

  logger.info('Incoming request to api/ipfs', requestInfo)

  try {
    const throwErr = (status: string) => {
      logger.error(status, requestInfo)
      res.status(400).send(status)
    }

    if (!['get', 'option'].includes(`${req.method}`.toLowerCase())) {
      throwErr('Error: Only GET and OPTION methods are allowed')
      return
    }
    if (!cid || !cid.match(DESC_CID)) {
      throwErr('Error: Invalid cid, it should be CIDv1 base32')
      return
    }

    const url = getExternalUrlFromCID(cid)

    const cached = cache.get(url)

    if (cached) {
      res.status(200).send(cached)
    } else {
      const result = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-type': 'text/plain',
          // 100kb max description filesize (about 50k words)
          range: 'bytes=0-100000',
        },
        signal: AbortSignal.timeout(ABORT_TIMEOUT),
      })

      const parsed = await result.text()

      const hash = await Hash.of(parsed, { cidVersion: 1, rawLeaves: true })

      if (hash !== cid) {
        throwErr('Error: Invalid data')
        return
      }

      if (result.ok) {
        cache.put(url, parsed, IPFS_CACHE_TTL)
      }

      res.status(result.status).send(parsed)
    }

    logger.info('Request to api/ipfs successfully fullfilled', {
      ...requestInfo,
      stage: 'FULFILLED',
    })
  } catch (error) {
    logger.error(
      error instanceof Error ? error.message : 'Something went wrong',
      error,
    )
    res.status(500).send('Something went wrong!')
  }
}
