import { Gauge } from 'prom-client'
import { METRICS_PREFIX } from './constants'
import getConfig from 'next/config'
import { getContractAddressList } from 'modules/contracts/utils/getContractAddressList'
import { CHAINS } from '@lido-sdk/constants'

const { publicRuntimeConfig } = getConfig()
const { defaultChain, supportedChains } = publicRuntimeConfig

const defaultChainId = +defaultChain as CHAINS

const contractNames = getContractAddressList(defaultChainId).map(
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
    const addressList = getContractAddressList(+chainId as CHAINS)
    const contractAddrs = addressList.map(({ address }) => address)
    contractInfo.labels(chainId, ...contractAddrs).set(1)
  })
} else {
  const addressList = getContractAddressList(defaultChainId)
  const contractAddrs = addressList.map(({ address }) => address)
  contractInfo.labels(defaultChain, ...contractAddrs).set(1)
}
