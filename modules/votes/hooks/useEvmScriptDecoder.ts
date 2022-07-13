import { useGlobalMemo } from 'modules/shared/hooks/useGlobalMemo'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useLocalStorage } from '@lido-sdk/react'

import { Contract } from 'ethers'
import { getRpcUrl } from 'modules/blockChain/utils/getRpcUrls'
import { ABIProvider } from 'evm-script-decoder/lib/types'
import { EVMScriptDecoder, abiProviders } from 'evm-script-decoder'
import { getStaticRpcBatchProvider } from '@lido-sdk/providers'

import {
  ACLAbi__factory,
  EasyTrackAbi__factory,
  FinanceAbi__factory,
  LidoDAOAbi__factory,
  MiniMeTokenAbi__factory,
  NodeOperatorsRegistryAbi__factory,
  OracleAbi__factory,
  RepoAbi__factory,
  StethAbi__factory,
  TokenManagerAbi__factory,
  TokenRecovererForManagerContractsAbi__factory,
  VotingAbi__factory,
  CompositePostRebaseBeaconReceiverAbi__factory,
  DepositSecurityModuleAbi__factory,
} from 'generated'
import * as ADDR from 'modules/blockChain/contractAddresses'
import { TreasuryAbi__factory } from 'generated/factories/TreasuryAbi__factory'
import { VotingRepoAbi__factory } from 'generated/factories/VotingRepoAbi__factory'
import { fetcherEtherscan } from 'modules/network/utils/fetcherEtherscan'
import { STORAGE_SKIP_BUNDLED_ABIS } from 'modules/config'

export function useEVMScriptDecoder(): EVMScriptDecoder {
  const { chainId } = useWeb3()
  const [skipBundledAbi] = useLocalStorage(STORAGE_SKIP_BUNDLED_ABIS, false)

  return useGlobalMemo(() => {
    const localDecoder = new abiProviders.Local({
      [ADDR.Voting[chainId]!]: VotingAbi__factory.abi as any,
      [ADDR.GovernanceToken[chainId]!]: MiniMeTokenAbi__factory.abi as any,
      [ADDR.TokenManager[chainId]!]: TokenManagerAbi__factory.abi,
      [ADDR.Finance[chainId]!]: FinanceAbi__factory.abi,
      [ADDR.NodeOperatorsRegistry[chainId]!]:
        NodeOperatorsRegistryAbi__factory.abi,
      [ADDR.Treasury[chainId]!]: TreasuryAbi__factory.abi,
      [ADDR.ACL[chainId]!]: ACLAbi__factory.abi,
      [ADDR.VotingRepo[chainId]!]: VotingRepoAbi__factory.abi,
      [ADDR.LidoDAO[chainId]!]: LidoDAOAbi__factory.abi,
      [ADDR.EasyTrack[chainId]!]: EasyTrackAbi__factory.abi,
      [ADDR.TokenRecovererForManagerContracts[chainId]!]:
        TokenRecovererForManagerContractsAbi__factory.abi,
      [ADDR.LidoAppRepo[chainId]!]: RepoAbi__factory.abi,
      [ADDR.NodeOperatorsRegistryRepo[chainId]!]: RepoAbi__factory.abi,
      [ADDR.Steth[chainId]!]: StethAbi__factory.abi,
      [ADDR.OracleRepo[chainId]!]: RepoAbi__factory.abi,
      [ADDR.Oracle[chainId]!]: OracleAbi__factory.abi,
      [ADDR.CompositePostRebaseBeaconReceiver[chainId]!]:
        CompositePostRebaseBeaconReceiverAbi__factory.abi,
      [ADDR.DepositSecurityModule[chainId]!]:
        DepositSecurityModuleAbi__factory.abi,
    })

    const etherscanDecoder = new abiProviders.Base({
      fetcher: async address => fetcherEtherscan(chainId, address),
      middlewares: [
        abiProviders.middlewares.ProxyABIMiddleware({
          implMethodNames: [
            ...abiProviders.middlewares.ProxyABIMiddleware
              .DefaultImplMethodNames,
            '__Proxy_implementation',
          ],
          loadImplAddress(proxyAddress, abiElement) {
            const contract = new Contract(
              proxyAddress,
              [abiElement],
              getStaticRpcBatchProvider(chainId, getRpcUrl(chainId)),
            )
            return contract[abiElement.name]()
          },
        }),
      ],
    })

    return new EVMScriptDecoder(
      ...([!skipBundledAbi && localDecoder, etherscanDecoder].filter(
        Boolean,
      ) as ABIProvider[]),
    )
  }, `evm-script-decoder-${chainId}-${skipBundledAbi ? 'no-local' : 'with-local'}`)
}
