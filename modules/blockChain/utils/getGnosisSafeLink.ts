import get from 'lodash/get'
import { CHAINS } from '@lido-sdk/constants'

const PREFIXES = {
  [CHAINS.Mainnet]: 'eth',
  [CHAINS.Rinkeby]: 'rin',
} as const

export const getGnosisSafeLink = (chainId: CHAINS, address: string) =>
  `https://gnosis-safe.io/app/${get(PREFIXES, chainId, '?')}:${address}`
