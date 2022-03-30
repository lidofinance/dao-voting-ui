import { Gauge } from 'prom-client'
import { METRICS_PREFIX } from './constants'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()
const { defaultChain, supportedChains } = publicRuntimeConfig

export const chainInfo = new Gauge({
  name: METRICS_PREFIX + 'chain_info',
  help: 'Default chain and supported chains of the current build',
  labelNames: ['default_chain', 'supported_chain'],
  registers: [],
})

chainInfo.labels({ default_chain: defaultChain }).set(1)

if (typeof supportedChains === 'string') {
  supportedChains.split(',').forEach(chainId => {
    chainInfo.labels({ supported_chain: chainId }).set(1)
  })
}
