import getConfig from 'next/config'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ChainNames, parseChainId } from 'modules/blockChain/chains'
import { fetchWithFallback } from 'modules/network/utils/fetchWithFallback'
import { CHAINS } from '@lido-sdk/constants'
import { logger } from 'modules/shared/utils/log'
import clone from 'just-clone'

const { serverRuntimeConfig } = getConfig()
const { etherscanApiKey } = serverRuntimeConfig

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

    const requested = await fetchWithFallback([url], chainId, {
      method: 'POST',
      body: JSON.stringify(req.body),
    })

    const responded = await requested.json()

    res.status(requested.status).json(responded.result)

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
