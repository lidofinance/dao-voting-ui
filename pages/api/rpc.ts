import clone from 'just-clone'
import getConfig from 'next/config'
import { CHAINS } from '@lido-sdk/constants'
import { parseChainId } from 'modules/blockChain/chains'
import { fetchWithFallback } from 'modules/network/utils/fetchWithFallback'
import type { NextApiRequest, NextApiResponse } from 'next'

const { serverRuntimeConfig } = getConfig()
const { rpcUrls_1, rpcUrls_5 } = serverRuntimeConfig

export default async function rpc(req: NextApiRequest, res: NextApiResponse) {
  const RPC_URLS: Record<number, string[]> = {
    [CHAINS.Mainnet]: rpcUrls_1,
    [CHAINS.Goerli]: rpcUrls_5,
  }

  const requestInfo = {
    type: 'API request',
    path: 'rpc',
    body: clone(req.body),
    query: clone(req.query),
    method: req.method,
    stage: 'INCOMING',
  }

  console.info('Incoming request to api/rpc', requestInfo)

  try {
    const chainId = parseChainId(String(req.query.chainId))
    const urls = RPC_URLS[chainId]

    const requested = await fetchWithFallback(urls, chainId, {
      method: 'POST',
      // Next by default parses our body for us, we don't want that here
      body: JSON.stringify(req.body),
    })

    const responded = await requested.json()

    res.status(requested.status).json(responded)

    console.info('Request to api/rpc successfully fullfilled', {
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
