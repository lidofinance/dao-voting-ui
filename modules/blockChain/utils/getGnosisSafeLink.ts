import get from 'lodash/get'
import { CHAINS } from '@lido-sdk/constants'

const PREFIXES = {
  [CHAINS.Mainnet]: 'eth',
  [CHAINS.Goerli]: 'gor',
  [CHAINS.Holesky]: 'holesky',
} as const

export const getGnosisSafeLink = (chainId: CHAINS, address: string) => {
  if (chainId === CHAINS.Holesky) {
    return `https://holesky-safe.protofire.io/transactions/queue?safe=holesky:${address}`
  }

  return `https://app.safe.global/transactions/queue?safe=${get(
    PREFIXES,
    chainId,
    '?',
  )}:${address}`
}
