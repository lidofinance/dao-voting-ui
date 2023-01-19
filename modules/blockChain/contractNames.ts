import * as contracts from './contractAddresses'

export type ContractNames = keyof typeof contracts

export const contractNamesMap = Object.keys(contracts).reduce(
  (map, key) => ({ ...map, [key]: key }),
  {} as { [i in ContractNames]: i },
)

export type ContractNamesMap = typeof contractNamesMap
