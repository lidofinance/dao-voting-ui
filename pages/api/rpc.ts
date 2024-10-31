import clone from 'just-clone'
import getConfig from 'next/config'
import { CHAINS } from '@lido-sdk/constants'
import { commonPatterns, satanizer } from '@lidofinance/satanizer'
import { parseChainId } from 'modules/blockChain/chains'
import { fetchWithFallback } from 'modules/network/utils/fetchWithFallback'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from 'ethers'
import { AragonVoting } from '../../modules/blockChain/contractAddresses'
import { AragonVotingAbi__factory } from '../../generated'

const { serverRuntimeConfig } = getConfig()
const { rpcUrls_1, rpcUrls_5, rpcUrls_17000 } = serverRuntimeConfig

interface IRpcRequest {
  method: string
  params: any[]
  id: number
  jsonrpc: '2.0'
}
interface IRpcResponse {
  jsonrpc: '2.0'
  id: number
  result: any[]
}
interface IStat {
  req: IRpcRequest
  res?: IRpcResponse
  date: string
  trace: string
  voteId: number
}

const patterns = [
  ...commonPatterns,
  process.env.INFURA_API_KEY,
  process.env.ALCHEMY_API_KEY,
  process.env.ETHERSCAN_API_KEY,
  process.env.WALLETCONNECT_PROJECT_ID,
  ...(process.env.EL_RPC_URLS_1 || 'NO_EL_RPC_URLS_1').split(','),
  ...(process.env.EL_RPC_URLS_17000 || 'NO_EL_RPC_URLS_17000').split(','),
]
const mask = satanizer(patterns)

const isStartFromTopic = (topic: string) => (req: IRpcRequest) =>
  req.method === 'eth_getLogs' && req.params[0]?.topics?.[0] === topic

const getVoteIdFromRequest = (req: any) => Number(req?.params?.[0]?.topics?.[1])

const hasNoResult = (item: any) => item?.res?.result?.length === 0
const hasVoteId = (item: any) => !isNaN(item.voteId)

export default async function rpc(req: NextApiRequest, res: NextApiResponse) {
  const RPC_URLS: Record<number, string[]> = {
    [CHAINS.Mainnet]: rpcUrls_1,
    [CHAINS.Goerli]: rpcUrls_5,
    [CHAINS.Holesky]: rpcUrls_17000,
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
      headers: {
        'Content-type': 'application/json',
      },
    })

    const responded: IRpcResponse[] = await requested.json()
    try {
      const contractVoting = new ethers.Contract(
        AragonVoting[chainId] ?? '',
        AragonVotingAbi__factory.abi,
      )
      const filter = contractVoting.filters.StartVote()
      const startVoteTopic = String(filter.topics?.[0])

      const requests = Array.isArray(req.body) ? req.body : [req.body]

      const voteEvents: IStat[] = requests
        .filter(isStartFromTopic(startVoteTopic))
        .map((item: IRpcRequest) => ({
          req: item,
          res: responded.find(resp => resp.id === item.id),
          date: requested.headers.get('date') ?? '',
          trace: requested.headers.get('x-drpc-trace-id') ?? '',
          voteId: getVoteIdFromRequest(item),
        }))

      const lostVoteEvents = voteEvents.filter(hasNoResult).filter(hasVoteId)

      lostVoteEvents.forEach(item => {
        console.error({
          message: `Lost log event for vote #${item.voteId}`,
          chainId,
          ...item,
        })
      })
    } catch (err) {
      console.error(`Failed on empty log response verification`)
      console.error(
        mask({
          date: requested.headers.get('date') ?? '',
          trace: requested.headers.get('x-drpc-trace-id') ?? '',
          requestCount: req.body?.length || 1,
        }),
      )
      console.error(mask(err))
    }

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
