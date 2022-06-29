import { CHAINS } from '@lido-sdk/constants'
import { etherscanApiUrl } from './apiUrls'
import { fetcherStandard } from './fetcherStandard'

export function fetcherEtherscan<T>(chainId: CHAINS, contractAddress: string) {
  return fetcherStandard<T>(
    `${etherscanApiUrl}?chainId=${chainId}&address=${contractAddress}`,
  )
}
