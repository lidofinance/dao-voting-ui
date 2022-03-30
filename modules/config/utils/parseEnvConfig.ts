import { parseChainId } from 'modules/blockChain/chains'
import { EnvConfig, Config } from '../types'

export function parseEnvConfig(envConfig: EnvConfig): Config {
  return {
    defaultChain: parseChainId(envConfig.defaultChain),
    supportedChainIds: envConfig.supportedChains.split(',').map(parseChainId),
  }
}
