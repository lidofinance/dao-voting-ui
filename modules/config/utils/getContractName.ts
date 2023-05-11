import { CHAINS } from '@lido-sdk/constants'
import * as addressMaps from 'modules/blockChain/contractAddresses'

export function getContractName(chainId: CHAINS, address: string) {
  return (Object.keys(addressMaps) as (keyof typeof addressMaps)[]).find(
    contractName =>
      addressMaps[contractName][chainId]?.toLowerCase() ===
      address.toLowerCase(),
  )
}
