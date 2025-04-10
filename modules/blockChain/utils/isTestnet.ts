import { CHAINS } from '@lido-sdk/constants'

export const isTestnet = (chainId: CHAINS) =>
  chainId === CHAINS.Holesky || chainId === CHAINS.Hoodi
