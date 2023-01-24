import get from 'lodash/get'
import { CHAINS } from '@lido-sdk/constants'
import { USERDOCS_MAP } from '../contractUserdocs'
import { getContractNameByAddress } from './getContractNameByAddress'
import { ContractNames } from '../types'

export function getUserdocByContractName(contractName: ContractNames) {
  return get(USERDOCS_MAP, contractName, undefined)
}

export function getUserdocByAddress(address: string, chainId: CHAINS) {
  const contractName = getContractNameByAddress(address, chainId)
  return contractName ? getUserdocByContractName(contractName) : undefined
}
