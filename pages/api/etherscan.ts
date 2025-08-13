import ms from 'ms'
import { Cache } from 'memory-cache'
import getConfig from 'next/config'
import type { NextApiRequest, NextApiResponse } from 'next'
import { parseChainId } from 'modules/blockChain/chains'
import { fetchWithFallback } from 'modules/network/utils/fetchWithFallback'
import clone from 'just-clone'
import { ETHERSCAN_CACHE_TTL, ETHERSCAN_REMOTE_URL } from 'modules/config'
import { etherscanResponseTime } from 'modules/shared/metrics/responseTime'

const { serverRuntimeConfig } = getConfig()
const { etherscanApiKey } = serverRuntimeConfig

const cache = new Cache<string, unknown>()

const ABORT_TIMEOUT = ms('5s')

export default async function etherscan(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const requestInfo = {
    type: 'API request',
    path: 'etherscan',
    body: clone(req.body),
    query: clone(req.query),
    method: req.method,
    stage: 'INCOMING',
  }

  console.info('Incoming request to api/etherscan', requestInfo)

  try {
    const throwErr = (status: string) => {
      console.error(status, requestInfo)
      res.status(400).json({ status })
    }

    if (!req.query.chainId) {
      throwErr('Error: chainId is required')
      return
    }

    if (!req.query.address) {
      throwErr('Error: address is required')
      return
    }

    const queryParams = [
      `chainId=${req.query.chainId}`,
      `module=${req.query.module}`,
      `action=${req.query.action}`,
      `address=${req.query.address}`,
      `apikey=${etherscanApiKey}`,
    ]

    const chainId = parseChainId(String(req.query.chainId))

    const url = `${ETHERSCAN_REMOTE_URL}?${queryParams.join('&')}`

    const cached = cache.get(url)

    if (cached) {
      res.status(200).json(cached)
    } else {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), ABORT_TIMEOUT)
      const endMetric = etherscanResponseTime
        .labels(String(chainId))
        .startTimer()

      const result = await fetchWithFallback([url], chainId, {
        method: 'POST',
        body: JSON.stringify(req.body),
        signal: controller.signal,
      })

      const parsed = await result.json()

      endMetric()
      clearTimeout(timeoutId)
      cache.put(url, parsed, ETHERSCAN_CACHE_TTL)
      res.status(result.status).json(parsed)
    }

    console.info('Request to api/etherscan successfully fullfilled', {
      ...requestInfo,
      stage: 'FULFILLED',
    })
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : 'Something went wrong',
      error,
    )
    res.status(500).send({ error: 'Something went wrong!' })
  }
}
