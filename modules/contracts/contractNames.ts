import { CONTRACT_ADDRESSES } from './contractAddresses'
import type { ContractNames, ContractNamesMap } from './types'

export const CONTRACT_NAMES_LIST = Object.keys(
  CONTRACT_ADDRESSES,
) as ContractNames[]

export const CONTRACT_NAMES_MAP = CONTRACT_NAMES_LIST.reduce(
  (map, key) => ({ ...map, [key]: key }),
  {} as ContractNamesMap,
)
