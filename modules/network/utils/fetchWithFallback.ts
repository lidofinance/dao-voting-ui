import { CHAINS } from '@lido-sdk/constants'
import { rpcResponseTime } from 'modules/shared/metrics/responseTime'

type FetchWithFallback = (
  inputs: RequestInfo[],
  chainId: CHAINS,
  init?: RequestInit | undefined,
) => Promise<Response>

export const fetchWithFallback: FetchWithFallback = async (
  inputs,
  chainId,
  init,
) => {
  const [input, ...restInputs] = inputs
  const hasFallback = Boolean(restInputs.length)
  try {
    const url = new URL(input as string)
    const end = rpcResponseTime
      .labels(url.hostname, String(chainId))
      .startTimer()
    const response = await fetch(input, init)
    end()

    if (!response.ok && hasFallback) {
      // try fallback, 4xx mostly related with token limits or etc.
      const text = await response.text()
      throw new Error(`Request failed status ${response.status} ${text}`)
    }

    return response
  } catch (error) {
    if (!hasFallback) throw error
    console.error(error)
    return fetchWithFallback(restInputs, chainId, init)
  }
}
