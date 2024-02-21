import get from 'lodash/get'
import { CHAINS } from '@lido-sdk/constants'

export const ChainNames = {
  [CHAINS.Mainnet]: 'Mainnet',
  [CHAINS.Ropsten]: 'Ropsten',
  [CHAINS.Rinkeby]: 'Rinkeby',
  [CHAINS.Goerli]: 'Goerli',
  [CHAINS.Kovan]: 'Kovan',
  [CHAINS.Kintsugi]: 'Kintsugi',
  [CHAINS.Kiln]: 'Kiln',
  [CHAINS.Moonbeam]: 'Moonbeam',
  [CHAINS.Moonriver]: 'Moonriver',
  [CHAINS.Moonbase]: 'Moonbase',
  [CHAINS.Holesky]: 'Holesky',
} as const

export const parseChainId = (chainId: number | string) => {
  return Number(chainId) as CHAINS
}

export const getChainName = (chainId: number) =>
  get(ChainNames, parseChainId(chainId))
