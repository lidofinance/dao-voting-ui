import { CHAINS } from '@lido-sdk/constants'

export type EnvConfigRaw = {
  defaultChain: string
  supportedChains: string
  ipfsMode: string
  settingsPrefillInfura: string
  settingsPrefillEtherscan: string
}

export type EnvConfigParsed = {
  defaultChain: CHAINS
  supportedChainIds: CHAINS[]
  ipfsMode: boolean
  settingsPrefillInfura: string
  settingsPrefillEtherscan: string
}
