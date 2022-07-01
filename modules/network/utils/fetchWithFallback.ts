import { CHAINS } from '@lido-sdk/constants'
import { ethereumResponse } from 'modules/shared/metrics/responseTime'

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

  try {
    const url = new URL(input as string)
    const end = ethereumResponse
      .labels(url.hostname, String(chainId))
      .startTimer()
    const response = await fetch(input, init)
    end()
    return response
  } catch (error) {
    if (!restInputs.length) throw error
    return fetchWithFallback(restInputs, chainId, init)
  }
}
