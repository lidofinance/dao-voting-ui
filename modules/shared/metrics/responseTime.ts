import { Histogram } from 'prom-client'
import { METRICS_PREFIX } from './constants'

export const rpcResponseTime = new Histogram({
  name: METRICS_PREFIX + 'ethereum_response',
  help: 'Ethereum response times',
  labelNames: ['provider', 'chainId'],
  buckets: [0.1, 0.2, 0.3, 0.6, 1, 1.5, 2, 5],
  registers: [],
})

export const etherscanResponseTime = new Histogram({
  name: METRICS_PREFIX + 'etherscan_service_response',
  help: 'Etherscan response time seconds',
  buckets: [0.1, 0.2, 0.3, 0.6, 1, 1.5, 2, 5],
  labelNames: ['chainId'],
  registers: [],
})

export const tenderlyResponseTime = new Histogram({
  name: METRICS_PREFIX + 'tenderly_response',
  help: 'Tenderly response times',
  labelNames: [],
  buckets: [0.1, 0.2, 0.3, 0.6, 1, 1.5, 2, 5],
  registers: [],
})
