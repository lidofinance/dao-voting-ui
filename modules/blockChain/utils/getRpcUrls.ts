import { CHAINS } from '@lido-sdk/constants'
import { parseChainId } from '../chains'
import getConfig from 'next/config'
import { getAlchemyRPCUrl, getInfuraRPCUrl, getRPCUrls } from '@lido-sdk/fetch'

const { serverRuntimeConfig } = getConfig()
const { basePath, infuraApiKey, alchemyApiKey } = serverRuntimeConfig

export const getInfuraRpcUrl = (chainId: CHAINS) =>
  getInfuraRPCUrl(chainId, infuraApiKey)

export const getAlchemyRpcUrl = (chainId: CHAINS) =>
  getAlchemyRPCUrl(chainId, alchemyApiKey)

export const getRpcJsonUrls = (chainId: CHAINS): string[] =>
  getRPCUrls(chainId, {
    infura: infuraApiKey,
    alchemy: alchemyApiKey,
  })

export const getRpcUrl = (chainId: CHAINS) =>
  `${basePath ?? ''}/api/rpc?chainId=${parseChainId(chainId)}`

export const backendRPC = {
  [CHAINS.Mainnet]: getRpcUrl(CHAINS.Mainnet),
  [CHAINS.Goerli]: getRpcUrl(CHAINS.Goerli),
  [CHAINS.Kovan]: getRpcUrl(CHAINS.Kovan),
  [CHAINS.Rinkeby]: getRpcUrl(CHAINS.Rinkeby),
  [CHAINS.Ropsten]: getRpcUrl(CHAINS.Ropsten),
}
