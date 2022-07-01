import { Histogram } from 'prom-client'
import { METRICS_PREFIX } from './constants'

export const rpcResponseTime = new Histogram({
  name: METRICS_PREFIX + 'etherscan_response',
  help: 'Etherscan response time seconds',
  buckets: [0.1, 0.2, 0.3, 0.6, 1, 1.5, 2, 5],
  labelNames: ['provider', 'chainId'],
  registers: [],
})

export const etherscanResponseTime = new Histogram({
  name: METRICS_PREFIX + 'rpc_service_response',
  help: 'RPC service response time seconds',
  buckets: [0.1, 0.2, 0.3, 0.6, 1, 1.5, 2, 5],
  registers: [],
})
