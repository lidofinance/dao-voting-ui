import { CHAINS } from '@lido-sdk/constants'

export const ChainNames = {
  [CHAINS.Mainnet]: 'Mainnet',
  [CHAINS.Ropsten]: 'Ropsten',
  [CHAINS.Rinkeby]: 'Rinkeby',
  [CHAINS.Goerli]: 'Goerli',
  [CHAINS.Kovan]: 'Kovan',
  [CHAINS.Kintsugi]: 'Kintsugi',
  [CHAINS.Moonriver]: 'Moonriver',
  [CHAINS.Moonbase]: 'Moonbase',
} as const

export const parseChainId = (chainId: number | string) => {
  return Number(chainId) as CHAINS
}

export const getChainName = (chainId: number) =>
  ChainNames[parseChainId(chainId)]
