import { CHAINS } from '@lido-sdk/constants'
import * as addressMaps from 'modules/blockChain/contractAddresses'

export function getAddressList(chainId: CHAINS): {
  contractName: string
  address: string
}[] {
  const contractNames = Object.keys(addressMaps)
  return contractNames.map(contractName => {
    const address = (addressMaps as Record<string, Record<number, string>>)[
      contractName
    ][chainId]

    return {
      contractName,
      address,
    }
  })
}
