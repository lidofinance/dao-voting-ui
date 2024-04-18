import clone from 'just-clone'
import getConfig from 'next/config'
import { CHAINS } from '@lido-sdk/constants'
import { parseChainId } from 'modules/blockChain/chains'
import { fetchWithFallback } from 'modules/network/utils/fetchWithFallback'
import type { NextApiRequest, NextApiResponse } from 'next'

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
const isLogsRequest = (item: any) => item?.method === 'eth_getLogs'
const hasResult = (item: any) => item.data?.result?.length > 0

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

    const rpcReq = (chainUrls: string[]) =>
      fetchWithFallback(chainUrls, chainId, {
        method: 'POST',
        // Next by default parses our body for us, we don't want that here
        body: JSON.stringify(req.body),
      })

    const needCompareWithFallback = req.body.some(isLogsRequest) // assign false to off comparison
    const requests: [Promise<Response>, Promise<Response | null>] =
      urls[1] && needCompareWithFallback
        ? [rpcReq(urls), rpcReq([urls[1]]).catch(() => null)]
        : [rpcReq(urls), Promise.resolve(null)]

    const [requested, requestedFb] = await Promise.all(requests)

    const responded: IRpcResponse[] = await requested.json()

    // this part for detecting issue with loose answer to eth_getLogs request
    if (requestedFb) {
      const respondedFb: IRpcResponse[] = await requestedFb.json()

      const mixed = req.body.filter(isLogsRequest).map((item: IRpcRequest) => ({
        req: item,
        res: [
          {
            data: responded.find(resp => resp.id === item.id),
            date: requested.headers.get('date'),
            trace: requested.headers.get('x-drpc-trace-id'),
          },
          {
            data: respondedFb.find(resp => resp.id === item.id),
            date: requestedFb.headers.get('date'),
            trace: requestedFb.headers.get('x-drpc-trace-id'),
          },
        ],
      }))

      mixed.forEach((item: any) => {
        let index = -1
        let message = 'no blockers'
        index = !hasResult(item.res[0]) && hasResult(item.res[1]) ? 0 : index
        index = hasResult(item.res[0]) && !hasResult(item.res[1]) ? 1 : index

        if (index != -1) {
          message = 'One chain loose rpc logs'
        }

        if (!hasResult(item.res[0]) && !hasResult(item.res[1])) {
          index = 1
          message = 'Both chains loose rpc logs'
        }

        if (index != -1) {
          const { data, date, trace } = item.res[index]
          console.info({
            message,
            urlIndex: index,
            chainId,
            date,
            trace,
            req: item.req,
            res: data,
          })
        }
      })
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
