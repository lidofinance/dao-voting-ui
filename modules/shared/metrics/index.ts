import { collectDefaultMetrics, Registry } from 'prom-client'
import { buildInfo } from './buildInfo'
import { chainInfo } from './chainInfo'
import { METRICS_PREFIX } from './constants'
import { contractInfo } from './contractInfo'
import { rpcResponseTime, etherscanResponseTime } from './responseTime'

const registry = new Registry()

if (process.env.NODE_ENV === 'production') {
  registry.registerMetric(buildInfo)
  registry.registerMetric(chainInfo)
  registry.registerMetric(contractInfo)
  registry.registerMetric(rpcResponseTime)
  registry.registerMetric(etherscanResponseTime)

  collectDefaultMetrics({ prefix: METRICS_PREFIX, register: registry })
}

export { registry }
