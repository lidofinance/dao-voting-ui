import { CHAINS } from '../chains'

export const isTestnet = (chainId: CHAINS) =>
  chainId === CHAINS.Holesky || chainId === CHAINS.Hoodi
