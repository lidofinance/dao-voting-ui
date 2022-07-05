import ms from 'ms'
import { Cache } from 'memory-cache'
import getConfig from 'next/config'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ChainNames, parseChainId } from 'modules/blockChain/chains'
import { fetchWithFallback } from 'modules/network/utils/fetchWithFallback'
import { CHAINS } from '@lido-sdk/constants'
import { logger } from 'modules/shared/utils/log'
import clone from 'just-clone'
import { ETHERSCAN_CACHE_TTL } from 'modules/config'
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

  logger.info('Incoming request to api/etherscan', requestInfo)

  try {
    const throwErr = (status: string) => {
      logger.error(status, requestInfo)
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

    const address = req.query.address
    const chainId = parseChainId(String(req.query.chainId))
    const chainName = ChainNames[chainId!].toLowerCase()

    const etherscanUrl =
      chainId === CHAINS.Mainnet
        ? 'https://api.etherscan.io/api'
        : `https://api-${chainName}.etherscan.io/api`

    const queryParams = [
      'module=contract',
      'action=getabi',
      `address=${address}`,
      `apikey=${etherscanApiKey}`,
    ]

    const url = `${etherscanUrl}?${queryParams.join('&')}`

    const cached = cache.get(url)

    if (cached) {
      res.status(200).json(cached)
    } else {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), ABORT_TIMEOUT)
      const endMetric = etherscanResponseTime
        .labels(String(chainId))
        .startTimer()

      const requested = await fetchWithFallback([url], chainId, {
        method: 'POST',
        body: JSON.stringify(req.body),
        signal: controller.signal,
      })

      const { result } = await requested.json()

      endMetric()
      clearTimeout(timeoutId)
      cache.put(url, result, ETHERSCAN_CACHE_TTL)
      res.status(requested.status).json(result)
    }

    logger.info('Request to api/etherscan successfully fullfilled', {
      ...requestInfo,
      stage: 'FULFILLED',
    })
  } catch (error) {
    logger.error(
      error instanceof Error ? error.message : 'Something went wrong',
      error,
    )
    res.status(500).send({ error: 'Something went wrong!' })
  }
}
