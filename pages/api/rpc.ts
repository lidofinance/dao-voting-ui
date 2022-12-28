import clone from 'just-clone'
import getConfig from 'next/config'
import { getAlchemyRPCUrl, getInfuraRPCUrl } from '@lido-sdk/fetch'
import { parseChainId } from 'modules/blockChain/chains'
import { fetchWithFallback } from 'modules/network/utils/fetchWithFallback'
import { logger } from 'modules/shared/utils/log'
import type { NextApiRequest, NextApiResponse } from 'next'

const { serverRuntimeConfig } = getConfig()
const { infuraApiKey, alchemyApiKey } = serverRuntimeConfig

export default async function rpc(req: NextApiRequest, res: NextApiResponse) {
  const requestInfo = {
    type: 'API request',
    path: 'rpc',
    body: clone(req.body),
    query: clone(req.query),
    method: req.method,
    stage: 'INCOMING',
  }

  logger.info('Incoming request to api/rpc', requestInfo)

  try {
    const chainId = parseChainId(String(req.query.chainId))
    const urls = [
      getAlchemyRPCUrl(chainId, alchemyApiKey),
      getInfuraRPCUrl(chainId, infuraApiKey),
    ]

    const requested = await fetchWithFallback(urls, chainId, {
      method: 'POST',
      // Next by default parses our body for us, we don't want that here
      body: JSON.stringify(req.body),
    })

    const responded = await requested.json()

    res.status(requested.status).json(responded)

    logger.info('Request to api/rpc successfully fullfilled', {
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
