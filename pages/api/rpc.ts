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
  result?: any[]
  error?: string
}

interface IReqRes {
  req: IRpcRequest
  res?: IRpcResponse
  date: string
  trace: string
  topics0: string[]
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

const isLogs = (req: IRpcRequest) => req.method === 'eth_getLogs'

const isReqTopic = (topic: string) => (item: IReqRes) =>
  item.topics0.includes(topic)

const isResEventTopicWrong = (item: IReqRes) =>
  item.topics0.length &&
  !item.res?.result?.every(result => item.topics0.includes(result?.topics[0]))

const isContainError = (item: IReqRes) => item.res?.error

const getVoteIdFromRequest = (req: any) => Number(req?.params?.[0]?.topics?.[1])

const getReqStartTopics = (req: any) => {
  const topic = req?.params?.[0]?.topics?.[0]
  if (!topic) {
    return []
  }
  return Array.isArray(topic) ? topic : [topic]
}

const hasNoResult = (item: IReqRes) => item.res?.result?.length === 0
const hasVoteId = (item: IReqRes) => !isNaN(item.voteId)

const getIncorrectItems = (
  requests: IRpcRequest[],
  results: IRpcResponse[],
  headers: Headers,
  chainId: CHAINS,
) => {
  const incorrectRequests: IRpcRequest[] = []
  try {
    // prepare getLog data
    const reqResp: IReqRes[] = requests
      .filter(isLogs)
      .map((item: IRpcRequest) => ({
        req: item,
        res: results.find(resp => resp.id === item.id),
        date: headers.get('date') ?? '',
        trace: headers.get('x-drpc-trace-id') ?? '',
        topics0: getReqStartTopics(item),
        voteId: getVoteIdFromRequest(item),
      }))

    // expected match request topic0 and event topic0
    const resContainSideEvents = reqResp.filter(isResEventTopicWrong)
    resContainSideEvents.forEach(item => {
      incorrectRequests.push(item.req)
      console.error({
        message: `Incorrect response: req topic0 not match resp event topic0`,
        chainId,
        ...item,
      })
    })

    // get StartVote keccak
    const contractVoting = new ethers.Contract(
      AragonVoting[chainId] ?? '',
      AragonVotingAbi__factory.abi,
    )
    const filter = contractVoting.filters.StartVote()
    const startVoteTopic = String(filter.topics?.[0])

    // expected not empty response
    const resLostVoteEvents = reqResp
      .filter(isReqTopic(startVoteTopic))
      .filter(hasNoResult)
      .filter(hasVoteId)

    resLostVoteEvents.forEach(item => {
      incorrectRequests.push(item.req)
      console.error({
        message: `Incorrect response: lost log event for vote #${item.voteId}`,
        chainId,
        ...item,
      })
    })

    // expected no errors
    const resContainError = reqResp.filter(isContainError)
    resContainError.forEach(item => {
      incorrectRequests.push(item.req)
      console.error({
        message: `Incorrect response: response contain error ${item.res?.error}`,
        chainId,
        ...item,
      })
    })
  } catch (err) {
    console.error(`Failed on 'getLogs' response verification`)
    console.error(
      mask({
        date: headers.get('date') ?? '',
        trace: headers.get('x-drpc-trace-id') ?? '',
        requestCount: requests.length || 1,
      }),
    )
    console.error(mask(err))
  }
  return incorrectRequests
}

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
    const fetchRPC = (urls: string[], body: any) =>
      fetchWithFallback(urls, chainId, {
        method: 'POST',
        // Next by default parses our body for us, we don't want that here
        body: JSON.stringify(body),
        headers: {
          'Content-type': 'application/json',
        },
      })

    const urls = RPC_URLS[chainId]
    const { body } = req
    let requests: IRpcRequest[] = Array.isArray(body) ? body : [body]
    const responseFirst = await fetchRPC(urls, requests)
    let results: IRpcResponse[] = await responseFirst.json()
    let responseHeaders = responseFirst.headers

    // Unfortunately, a successful response does not guarantee that the received data is correct
    // Try to do a simple check of the results of getLogs and request fallback if there is a suspicion of incorrectness
    for (let ind = 1; ind < urls.length; ind++) {
      requests = getIncorrectItems(requests, results, responseHeaders, chainId)
      if (!requests.length) {
        break
      }
      const response = await fetchRPC(urls.slice(ind), requests)
      responseHeaders = response.headers

      const responseData: IRpcResponse[] = await response.json()
      responseData.forEach(item => {
        const index = results.findIndex(result => result.id === item.id)
        responseData[index] = item
      })
    }
    const { headers, status } = responseFirst
    res
      .setHeader('x-drpc-trace-id', headers.get('x-drpc-trace-id') ?? '')
      .setHeader('x-drpc-owner-tier', headers.get('x-drpc-owner-tier') ?? '')
      .setHeader('x-drpc-date', headers.get('date') ?? '')
      .status(status)
      .json(Array.isArray(body) ? results : results[0])

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
