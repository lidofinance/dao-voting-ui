import { CONTRACT_ADDRESSES } from '../contractAddresses'
import { isAddressesEqual } from 'modules/blockChain/utils/isAddressesEqual'
import type { CHAINS } from '@lido-sdk/constants'
import type { ContractNames } from '../types'

export function getContractNameByAddress(address: string, chainId: CHAINS) {
  return (Object.keys(CONTRACT_ADDRESSES) as ContractNames[]).find(name =>
    isAddressesEqual(CONTRACT_ADDRESSES[name][chainId]!, address),
  )
}
