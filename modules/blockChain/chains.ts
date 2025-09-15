import get from 'lodash/get'

export enum CHAINS {
  Mainnet = 1,
  Holesky = 17000,
  Hoodi = 560048,
}

export const ChainNames = {
  [CHAINS.Mainnet]: 'Mainnet',
  [CHAINS.Holesky]: 'Holesky',
  [CHAINS.Hoodi]: 'Hoodi',
} as const

export const parseChainId = (chainId: number | string) => {
  return Number(chainId) as CHAINS
}

export const getChainName = (chainId: number) =>
  get(ChainNames, parseChainId(chainId))
