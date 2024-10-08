import { useGlobalMemo } from 'modules/shared/hooks/useGlobalMemo'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useConfig } from 'modules/config/hooks/useConfig'

import { Contract } from 'ethers'
import { ABIProvider } from '@lidofinance/evm-script-decoder/lib/types'
import { EVMScriptDecoder, abiProviders } from '@lidofinance/evm-script-decoder'
import { getStaticRpcBatchProvider } from '@lido-sdk/providers'

import * as abis from 'generated'
import * as ADDR from 'modules/blockChain/contractAddresses'
import { fetcherEtherscan } from 'modules/network/utils/fetcherEtherscan'

export function useEVMScriptDecoder(): EVMScriptDecoder {
  const { chainId } = useWeb3()
  const { getRpcUrl, savedConfig } = useConfig()
  const rpcUrl = getRpcUrl(chainId)
  const { etherscanApiKey, useBundledAbi } = savedConfig

  return useGlobalMemo(() => {
    const KEYS = Object.keys(ADDR).reduce(
      (keys, contractName: keyof typeof ADDR) => ({
        ...keys,
        [contractName]: ADDR[contractName][chainId]!,
      }),
      {} as Record<keyof typeof ADDR, string>,
    )

    const localDecoder = new abiProviders.Local({
      [KEYS.AragonVoting]: abis.AragonVotingAbi__factory.abi as any,
      [KEYS.GovernanceToken]: abis.MiniMeTokenAbi__factory.abi as any,
      [KEYS.TokenManager]: abis.TokenManagerAbi__factory.abi,
      [KEYS.AragonFinance]: abis.AragonFinanceAbi__factory.abi,
      [KEYS.NodeOperatorsRegistry]: abis.NodeOperatorsRegistryAbi__factory.abi,
      [KEYS.AragonAgent]: abis.AragonAgentAbi__factory.abi,
      [KEYS.AragonACL]: abis.AragonACLAbi__factory.abi,
      [KEYS.VotingRepo]: abis.VotingRepoAbi__factory.abi,
      [KEYS.LidoDAO]: abis.LidoDAOAbi__factory.abi,
      [KEYS.EasyTrack]: abis.EasyTrackAbi__factory.abi,
      [KEYS.TokenRecovererForManagerContracts]:
        abis.TokenRecovererForManagerContractsAbi__factory.abi,
      [KEYS.LidoAppRepo]: abis.RepoAbi__factory.abi,
      [KEYS.NodeOperatorsRegistryRepo]: abis.RepoAbi__factory.abi,
      [KEYS.Steth]: abis.StethAbi__factory.abi,
      [KEYS.OracleRepo]: abis.RepoAbi__factory.abi,
      [KEYS.LegacyOracle]: abis.LegacyOracleAbi__factory.abi,
      [KEYS.CompositePostRebaseBeaconReceiver]:
        abis.CompositePostRebaseBeaconReceiverAbi__factory.abi,
      [KEYS.DepositSecurityModule]: abis.DepositSecurityModuleAbi__factory.abi,
      [KEYS.WithdrawalVault]: abis.WithdrawalVaultAbi__factory.abi,
      [KEYS.ShapellaUpgradeTemplate]:
        abis.ShapellaUpgradeTemplateAbi__factory.abi,
      [KEYS.StakingRouter]: abis.StakingRouterAbi__factory.abi,
      [KEYS.LidoLocator]: abis.LidoLocatorAbi__factory.abi,
      [KEYS.WithdrawalQueueERC721]: abis.WithdrawalQueueERC721Abi__factory.abi,
      [KEYS.OracleReportSanityChecker]:
        abis.OracleReportSanityCheckerAbi__factory.abi,
      [KEYS.HashConsensusAccountingOracle]: abis.HashConsensusAbi__factory.abi,
      [KEYS.HashConsensusValidatorsExitBus]: abis.HashConsensusAbi__factory.abi,
      [KEYS.AccountingOracle]: abis.AccountingOracleAbi__factory.abi,
      [KEYS.ValidatorsExitBusOracle]:
        abis.ValidatorsExitBusOracleAbi__factory.abi,
      [KEYS.WithdrawalQueueEarlyCommitment]:
        abis.WithdrawalQueueERC721Abi__factory.abi,
      [KEYS.MEVBoostRelayAllowedList]:
        abis.MEVBoostRelayAllowedListAbi__factory.abi,
      [KEYS.OracleDaemonConfig]: abis.OracleDaemonConfigAbi__factory.abi,
      [KEYS.TRPVestingEscrowFactory]:
        abis.TRPVestingEscrowFactoryAbi__factory.abi,
      [KEYS.ExecutionLayerRewardsVault]:
        abis.ExecutionLayerRewardsVaultAbi__factory.abi,
      [KEYS.Burner]: abis.BurnerAbi__factory.abi,
      [KEYS.SimpleDVT]: abis.NodeOperatorsRegistryAbi__factory.abi,
      [KEYS.L1ERC20TokenBridge]: abis.L1ERC20TokenBridgeAbi__factory.abi,
    })

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
