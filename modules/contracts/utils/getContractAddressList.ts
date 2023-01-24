import memoize from 'lodash/memoize'
import { CHAINS } from '@lido-sdk/constants'
import { CONTRACT_ADDRESSES } from '../contractAddresses'
import { CONTRACT_NAMES_LIST } from '../contractNames'

export const getContractAddressList = memoize((chainId: CHAINS) => {
  return CONTRACT_NAMES_LIST.map(contractName => {
    return {
      contractName,
      address: CONTRACT_ADDRESSES[contractName][chainId],
    }
  })
})
