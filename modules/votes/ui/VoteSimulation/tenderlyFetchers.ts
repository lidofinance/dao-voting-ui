import { CHAINS } from '@lido-sdk/constants'
import {
  TenderlyForkResponse,
  TenderlyResponseForksList,
  TenderlyResponseForkTransactionsList,
} from './type'

export const TENDERLY_API_URL = '/api/tenderly'

export const getForkSimulationUrl = (id: string) =>
  `https://dashboard.tenderly.co/shared/fork/simulation/${id}`

export const fetchForksList = async (): Promise<TenderlyResponseForksList> => {
  const res = await fetch(`${TENDERLY_API_URL}/forks`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return res.json()
}

export const fetchForkTransactionsList = async (
  forkId: string,
): Promise<TenderlyResponseForkTransactionsList> => {
  const res = await fetch(`${TENDERLY_API_URL}/fork/${forkId}/transactions`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return res.json()
}

export const requestSimulationShare = async (
  forkId: string,
  simulationId: string,
) => {
  await fetch(
    `${TENDERLY_API_URL}/fork/${forkId}/transaction/${simulationId}/share`,
    {
      method: 'POST',
    },
  )
}

export const requestNetworkFork = async (args: {
  chainId: CHAINS
}): Promise<TenderlyForkResponse> => {
  const res = await fetch(`${TENDERLY_API_URL}/fork`, {
    method: 'POST',
    body: JSON.stringify({
      network_id: String(args.chainId),
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return res.json()
}
