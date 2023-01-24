import type { CHAINS } from '@lido-sdk/constants'
import type { CONTRACT_ADDRESSES } from './contractAddresses'
import type { USERDOCS_MAP } from './contractUserdocs'

export type ChainAddressMap = Partial<Record<CHAINS, string>>

export type ContractNames = keyof typeof CONTRACT_ADDRESSES

export type ContractNamesMap = { [Name in ContractNames]: Name }

export type UserdocContractNames = keyof typeof USERDOCS_MAP

export type Userdoc = {
  kind?: string
  version?: number
  events?: {
    [key: string]: { notice: string }
  }
  methods?: {
    [key: string]: { notice: string }
  }
}
