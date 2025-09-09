import { useGlobalMemo } from 'modules/shared/hooks/useGlobalMemo'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useConfig } from 'modules/config/hooks/useConfig'

import { Contract } from 'ethers'
import {
  ABIProvider,
  ABIElement as ABIElementImported,
} from '@lidofinance/evm-script-decoder/lib/types'
import { EVMScriptDecoder, abiProviders } from '@lidofinance/evm-script-decoder'
import { getStaticRpcBatchProvider } from 'modules/blockChain/utils/rpcProviders'

import { fetcherEtherscan } from 'modules/network/utils/fetcherEtherscan'
import { useAbiMap } from 'modules/blockChain/hooks/useAbiMap'

export function useEVMScriptDecoder(): EVMScriptDecoder {
  const { chainId } = useWeb3()
  const { getRpcUrl, savedConfig } = useConfig()
  const rpcUrl = getRpcUrl(chainId)
  const { etherscanApiKey, useBundledAbi } = savedConfig
  const abiMap = useAbiMap()

  return useGlobalMemo(() => {
    const localDecoder = new abiProviders.Local(
      abiMap as Record<string, ABIElementImported[]>,
    )

    const etherscanDecoder = new abiProviders.Base({
      fetcher: async address => {
        const res = await fetcherEtherscan<string>({
          chainId,
          address,
          module: 'contract',
          action: 'getabi',
          apiKey: etherscanApiKey,
        })
        return JSON.parse(res)
      },
      middlewares: [
        abiProviders.middlewares.ProxyABIMiddleware({
          implMethodNames: [
            ...abiProviders.middlewares.ProxyABIMiddleware
              .DefaultImplMethodNames,
            '__Proxy_implementation',
            'proxy__getImplementation',
          ],
          loadImplAddress(proxyAddress, abiElement) {
            const contract = new Contract(
              proxyAddress,
              [abiElement],
              getStaticRpcBatchProvider(chainId, rpcUrl),
            )
            return contract[abiElement.name]()
          },
        }),
      ],
    })

    return new EVMScriptDecoder(
      ...([useBundledAbi && localDecoder, etherscanDecoder].filter(
        Boolean,
      ) as ABIProvider[]),
    )
  }, `evm-script-decoder-${chainId}-${rpcUrl}-${useBundledAbi ? 'with-local' : 'no-local'}-${etherscanApiKey}`)
}
