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
const { rpcUrls_1, rpcUrls_17000, rpcUrls_560048 } = serverRuntimeConfig

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
  reqTopics0: (string | null)[]
  reqTopic1: number
}

const patterns = [
  ...commonPatterns,
  process.env.INFURA_API_KEY,
  process.env.ALCHEMY_API_KEY,
  process.env.ETHERSCAN_API_KEY,
  process.env.WALLETCONNECT_PROJECT_ID,
  ...(process.env.EL_RPC_URLS_1 || 'NO_EL_RPC_URLS_1').split(','),
  ...(process.env.EL_RPC_URLS_17000 || 'NO_EL_RPC_URLS_17000').split(','),
  ...(process.env.EL_RPC_URLS_560048 || 'NO_EL_RPC_URLS_560048').split(','),
]
const mask = satanizer(patterns)

const isGetLogs = (req: IRpcRequest) => req.method === 'eth_getLogs'

const isReqTopicExact = (topic: string) => (item: IReqRes) =>
  item.reqTopics0.includes(topic) // ignore null topic

const isResEventTopicWrong = (item: IReqRes) =>
  item.reqTopics0.length &&
  !item.reqTopics0.includes(null) &&
  !item.res?.result?.every(result =>
    item.reqTopics0.includes(result?.topics?.[0]),
  )

const isContainError = (item: IReqRes) => item.res?.error

const getReqTopic1 = (req: any) => req?.params?.[0]?.topics?.[1]

const getReqTopics0 = (req: any) => {
  const topic = req?.params?.[0]?.topics?.[0]
  if (!topic) {
    return []
  }
  return Array.isArray(topic) ? topic : [topic]
}

const hasNoResult = (item: IReqRes) => item.res?.result?.length === 0
const hasVoteId = (item: IReqRes) => !isNaN(item.reqTopic1)

const getRequestsForRetry = (
  requests: IRpcRequest[],
  results: IRpcResponse[],
  headers: Headers,
  chainId: CHAINS,
) => {
  const incorrectRequests: IRpcRequest[] = []
  const addToIncorrectRequests = (item: IReqRes, message: string) => {
    incorrectRequests.push(item.req)
    console.error(`Incorrect response: ${message}`, chainId, mask({ ...item }))
  }
  try {
    // combine request, response and extra data
    const reqResp: IReqRes[] = requests
      .filter(isGetLogs)
      .map((item: IRpcRequest) => ({
        req: item,
        res: results.find(resp => resp.id === item.id),
        date: headers.get('date') ?? '',
        trace: headers.get('x-drpc-trace-id') ?? '',
        reqTopics0: getReqTopics0(item),
        reqTopic1: Number(getReqTopic1(item)), // check only as VoteId for now
      }))

    // expected match request topic0 and event topic0
    const resContainSideEvents = reqResp.filter(isResEventTopicWrong)
    resContainSideEvents.forEach(item =>
      addToIncorrectRequests(item, `req topic0 not match resp event topic0`),
    )

    const contractVoting = new ethers.Contract(
      AragonVoting[chainId] ?? '',
      AragonVotingAbi__factory.abi,
    )
    const filter = contractVoting.filters.StartVote()
    const startVoteTopic = String(filter.topics?.[0])

    // expected not empty response
    const resLostVoteEvents = reqResp
      .filter(isReqTopicExact(startVoteTopic))
      .filter(hasNoResult)
      .filter(hasVoteId)

    resLostVoteEvents.forEach(item =>
      addToIncorrectRequests(
        item,
        `lost log event for vote #${item.reqTopic1}`,
      ),
    )

    // expected no errors
    const resContainError = reqResp.filter(isContainError)
    resContainError.forEach(item =>
      addToIncorrectRequests(item, `response contain error ${item.res?.error}`),
    )
  } catch (err) {
    console.error(
      `Failed on 'getLogs' response verification`,
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

const prepareInit = (body: any) =>
  ({
    method: 'POST',
    // Next by default parses our body for us, we don't want that here
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json',
    },
  } as const)

const parseResponse = async (response: Response) => {
  const text = await response.text()
  try {
    const results: IRpcResponse[] = JSON.parse(text)
    return results
  } catch (err) {
    // usually could happen when response status 400+
    console.error(`Request failed status ${response.status} status ${text}`)
    throw err
  }
}

/**
 * Try to do a simple check of the results of getLogs and replace it by fallback responses:
 * - if getLogs return events with incorrect topic
 * - if getLogs not return events where it should be
 * - if getLogs return error
 * */
const correctGetLogs = async (
  body: IRpcRequest[],
  responses: IRpcResponse[],
  headers: Headers,
  chainId: CHAINS,
  urls: string[],
) => {
  let responseHeaders = headers
  let requests = body
  const results = [...responses]
  for (let ind = 1; ind < urls.length; ind++) {
    requests = getRequestsForRetry(requests, results, responseHeaders, chainId)
    if (!requests.length) {
      break
    }
    const restUrls = urls.slice(ind)
    const init = prepareInit(requests)
    const response = await fetchWithFallback(restUrls, chainId, init)
    responseHeaders = response.headers

    const responseData: IRpcResponse[] = await response.json()
    responseData.forEach(item => {
      const index = results.findIndex(result => result.id === item.id)
      responseData[index] = item
    })
  }
  return results
}

export default async function rpc(req: NextApiRequest, res: NextApiResponse) {
  const RPC_URLS: Record<number, string[]> = {
    [CHAINS.Mainnet]: rpcUrls_1,
    [CHAINS.Holesky]: rpcUrls_17000,
    [CHAINS.Hoodi]: rpcUrls_560048,
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
    const { body } = req
    // force to array of requests for universal processing before return
    const requests: IRpcRequest[] = Array.isArray(body) ? body : [body]
    const init = prepareInit(requests)
    const response = await fetchWithFallback(urls, chainId, init)
    let results = await parseResponse(response)
    const { headers, status, ok } = response

    if (ok) {
      // Even if response is success does not guarantee that the received data will be correct
      results = await correctGetLogs(requests, results, headers, chainId, urls)
    }
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
