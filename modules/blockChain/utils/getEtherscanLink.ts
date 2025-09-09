import invariant from 'tiny-invariant'
import { CHAINS } from '../chains'

export enum ETHERSCAN_ENTITIES {
  TX = 'tx',
  TOKEN = 'token',
  ADDRESS = 'address',
}

const ETHERSCAN_PREFIX_BY_NETWORK: Partial<Record<CHAINS, string>> = {
  [CHAINS.Mainnet]: '',
  [CHAINS.Holesky]: 'holesky.',
  [CHAINS.Hoodi]: 'hoodi.',
}

export const getEtherscanPrefix = (chainId: CHAINS) => {
  const prefix = ETHERSCAN_PREFIX_BY_NETWORK[chainId]
  invariant(prefix != null, 'Chain is not supported')
  return prefix
}

export const getEtherscanLink = (
  chainId: CHAINS,
  hash: string,
  entity: string,
) => {
  const prefix = getEtherscanPrefix(chainId)
  invariant(hash && typeof hash === 'string', 'Hash should be a string')
  invariant(entity && typeof entity === 'string', 'Entity should be a string')
  return `https://${prefix}etherscan.io/${entity}/${hash}`
}

export const getEtherscanTxLink = (chainId: number, hash: string): string => {
  return getEtherscanLink(chainId, hash, ETHERSCAN_ENTITIES.TX)
}

export const getEtherscanTokenLink = (
  chainId: number,
  hash: string,
): string => {
  return getEtherscanLink(chainId, hash, ETHERSCAN_ENTITIES.TOKEN)
}

export const getEtherscanAddressLink = (
  chainId: number,
  hash: string,
): string => {
  return getEtherscanLink(chainId, hash, ETHERSCAN_ENTITIES.ADDRESS)
}
