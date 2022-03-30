import { CHAINS } from '@lido-sdk/constants'

export type EnvConfig = {
  defaultChain: string
  supportedChains: string
}

export type Config = {
  defaultChain: CHAINS
  supportedChainIds: CHAINS[]
}
