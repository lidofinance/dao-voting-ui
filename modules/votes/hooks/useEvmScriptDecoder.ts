import { useGlobalMemo } from 'modules/shared/hooks/useGlobalMemo'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useConfig } from 'modules/config/hooks/useConfig'

import { Contract } from 'ethers'
import {
  ABIProvider,
  ABIElement as ABIElementImported,
} from '@lidofinance/evm-script-decoder/lib/types'
import { EVMScriptDecoder, abiProviders } from '@lidofinance/evm-script-decoder'
import { getStaticRpcBatchProvider } from '@lido-sdk/providers'

import * as abis from 'generated'
import * as ADDR from 'modules/blockChain/contractAddresses'
import { fetcherEtherscan } from 'modules/network/utils/fetcherEtherscan'

type ContractName = keyof typeof ADDR

// This is a little hack needed because some of local ABIs
// doesn't meet the ABIElement type requirements
type ABIElement = Omit<ABIElementImported, 'name' | 'type'> & {
  name?: string
  type?: string
}

// This object contains ABIs of contracts that are using the same ABI
// but have different names than the ABI file
const ABI_EXCEPTIONS = {
  HashConsensusAccountingOracle: abis.HashConsensusAbi__factory.abi,
  HashConsensusValidatorsExitBus: abis.HashConsensusAbi__factory.abi,
  LidoAppRepo: abis.RepoAbi__factory.abi,
  NodeOperatorsRegistryRepo: abis.RepoAbi__factory.abi,
  OracleRepo: abis.RepoAbi__factory.abi,
  SimpleDVT: abis.NodeOperatorsRegistryAbi__factory.abi,
} as const

type ExceptionContractName = keyof typeof ABI_EXCEPTIONS
type GeneralContractName = Exclude<ContractName, ExceptionContractName>

export function useEVMScriptDecoder(): EVMScriptDecoder {
  const { chainId } = useWeb3()
  const { getRpcUrl, savedConfig } = useConfig()
  const rpcUrl = getRpcUrl(chainId)
  const { etherscanApiKey, useBundledAbi } = savedConfig

  return useGlobalMemo(() => {
    // Map of contract addresses to their ABIs on the current chain
    // needed to initialize the localDecoder
    const abiMap = Object.keys(ADDR).reduce(
      (result, contractName: ContractName) => {
        const address = ADDR[contractName][chainId]
        if (!address) {
          return result
        }
        let abi: ABIElement[] | undefined
        if (contractName in ABI_EXCEPTIONS) {
          abi = ABI_EXCEPTIONS[contractName as ExceptionContractName]
        } else {
          // This line will show a compiler-level error if there is a declared contract in ADDR
          // that is not present neither in ABI_EXCEPTIONS nor in generated abis
          abi = abis[`${contractName as GeneralContractName}Abi__factory`].abi
        }

        return {
          ...result,
          [address]: abi,
        }
      },
      {} as Record<string, ABIElement[]>,
    )

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
