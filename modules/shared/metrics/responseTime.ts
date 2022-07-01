import { Histogram } from 'prom-client'
import { METRICS_PREFIX } from './constants'

export const ethereumResponse = new Histogram({
  name: METRICS_PREFIX + 'ethereum_response',
  help: 'Ethereum response times',
  labelNames: ['provider', 'chainId'],
  buckets: [0.1, 0.2, 0.3, 0.6, 1, 1.5, 2, 5],
  registers: [],
})

export const etherscanResponseTime = new Histogram({
  name: METRICS_PREFIX + 'rpc_service_response',
  help: 'RPC service response time seconds',
  buckets: [0.1, 0.2, 0.3, 0.6, 1, 1.5, 2, 5],
  registers: ['chainId'],
})
