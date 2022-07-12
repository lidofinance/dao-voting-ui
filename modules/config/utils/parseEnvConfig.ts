import { parseChainId } from 'modules/blockChain/chains'
import { EnvConfigRaw, EnvConfigParsed } from '../types'

export function parseEnvConfig(envConfig: EnvConfigRaw): EnvConfigParsed {
  return {
    defaultChain: parseChainId(envConfig.defaultChain),
    supportedChainIds: envConfig.supportedChains.split(',').map(parseChainId),
    ipfsMode: envConfig.ipfsMode === 'true',
  }
}
