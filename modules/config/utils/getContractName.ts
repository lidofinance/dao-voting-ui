import { CHAINS } from '@lido-sdk/constants'
import * as addressMaps from 'modules/blockChain/contractAddresses'

export function getContractName(chainId: CHAINS, address: string) {
  const lowerAddress = address.toLowerCase()
  const name = (Object.keys(addressMaps) as (keyof typeof addressMaps)[]).find(
    contractName => {
      const foundAddress = addressMaps[contractName][chainId]
      if (!foundAddress) {
        return false
      }
      if (typeof foundAddress === 'string') {
        return foundAddress.toLowerCase() === lowerAddress
      }
      return (
        foundAddress.actual.toLowerCase() === lowerAddress ||
        foundAddress.test.toLowerCase() === lowerAddress
      )
    },
  )

  if (!name) {
    return 'Unknown contract'
  }
}
