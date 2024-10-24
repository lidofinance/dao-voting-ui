import get from 'lodash/get'
import { CHAINS } from '@lido-sdk/constants'

export const ChainNames = {
  [CHAINS.Mainnet]: 'Mainnet',
  [CHAINS.Holesky]: 'Holesky',
} as const

export const parseChainId = (chainId: number | string) => {
  return Number(chainId) as CHAINS
}

export const getChainName = (chainId: number) =>
  get(ChainNames, parseChainId(chainId))
