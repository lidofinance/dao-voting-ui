import { Gauge } from 'prom-client'
import { METRICS_PREFIX } from './constants'
import getConfig from 'next/config'
import { getAddressList } from 'modules/config/utils/getAddressList'
import { CHAINS } from 'modules/blockChain/chains'

const { publicRuntimeConfig } = getConfig()
const { defaultChain, supportedChains } = publicRuntimeConfig

const defaultChainId = +defaultChain as CHAINS

const contractNames = getAddressList(defaultChainId).map(
  ({ contractName }) => contractName,
)

export const contractInfo = new Gauge({
  name: METRICS_PREFIX + 'contract_info',
  help: `Contract addresses for supported chains`,
  labelNames: ['chain_id', ...contractNames],
  registers: [],
})

if (typeof supportedChains === 'string') {
  supportedChains.split(',').forEach(chainId => {
    const addressList = getAddressList(+chainId as CHAINS)
    const contractAddrs = addressList.map(({ address }) => address)
    contractInfo.labels(chainId, ...contractAddrs).set(1)
  })
} else {
  const addressList = getAddressList(defaultChainId)
  const contractAddrs = addressList.map(({ address }) => address)
  contractInfo.labels(defaultChain, ...contractAddrs).set(1)
}
