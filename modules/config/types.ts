import { CHAINS } from 'modules/blockChain/chains'

export type EnvConfigRaw = {
  defaultChain: string
  supportedChains: string
  ipfsMode: string
}

export type EnvConfigParsed = {
  defaultChain: CHAINS
  supportedChainIds: CHAINS[]
  ipfsMode: boolean
}
