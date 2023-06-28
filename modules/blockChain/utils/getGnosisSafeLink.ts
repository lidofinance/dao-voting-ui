import get from 'lodash/get'
import { CHAINS } from '@lido-sdk/constants'

const PREFIXES = {
  [CHAINS.Mainnet]: 'eth',
  [CHAINS.Goerli]: 'gor',
} as const

export const getGnosisSafeLink = (chainId: CHAINS, address: string) =>
  `https://app.safe.global/transactions/history?safe=${get(
    PREFIXES,
    chainId,
    '?',
  )}:${address}`
