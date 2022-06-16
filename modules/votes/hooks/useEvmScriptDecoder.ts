import { useGlobalMemo } from 'modules/shared/hooks/useGlobalMemo'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import { EVMScriptDecoder } from 'evm-script-decoder/lib/EVMScriptDecoder'
import { ABIProviderLocal } from 'evm-script-decoder/lib/ABIProviderLocal'

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
import * as CONTRACT_ADDRESSES from 'modules/blockChain/contractAddresses'
import { TreasuryAbi__factory } from 'generated/factories/TreasuryAbi__factory'
import { VotingRepoAbi__factory } from 'generated/factories/VotingRepoAbi__factory'

export function useEVMScriptDecoder(): EVMScriptDecoder {
  const { chainId } = useWeb3()

  return useGlobalMemo(
    () =>
      new EVMScriptDecoder(
        new ABIProviderLocal({
          [CONTRACT_ADDRESSES.Voting[chainId]!]: VotingAbi__factory.abi as any,
          [CONTRACT_ADDRESSES.GovernanceToken[chainId]!]:
            MiniMeTokenAbi__factory.abi as any,
          [CONTRACT_ADDRESSES.TokenManager[chainId]!]:
            TokenManagerAbi__factory.abi as any,
          [CONTRACT_ADDRESSES.Finance[chainId]!]:
            FinanceAbi__factory.abi as any,
          [CONTRACT_ADDRESSES.NodeOperatorsRegistry[chainId]!]:
            NodeOperatorsRegistryAbi__factory.abi as any,
          [CONTRACT_ADDRESSES.Treasury[chainId]!]:
            TreasuryAbi__factory.abi as any,
          [CONTRACT_ADDRESSES.ACL[chainId]!]: ACLAbi__factory.abi as any,
          [CONTRACT_ADDRESSES.VotingRepo[chainId]!]:
            VotingRepoAbi__factory.abi as any,
          [CONTRACT_ADDRESSES.LidoDAO[chainId]!]:
            LidoDAOAbi__factory.abi as any,
          [CONTRACT_ADDRESSES.EasyTrack[chainId]!]:
            EasyTrackAbi__factory.abi as any,
          [CONTRACT_ADDRESSES.TokenRecovererForManagerContracts[chainId]!]:
            TokenRecovererForManagerContractsAbi__factory.abi as any,
          [CONTRACT_ADDRESSES.LidoAppRepo[chainId]!]:
            RepoAbi__factory.abi as any,
          [CONTRACT_ADDRESSES.NodeOperatorsRegistryRepo[chainId]!]:
            RepoAbi__factory.abi as any,
          [CONTRACT_ADDRESSES.Steth[chainId]!]: StethAbi__factory.abi as any,
          [CONTRACT_ADDRESSES.OracleRepo[chainId]!]:
            RepoAbi__factory.abi as any,
          [CONTRACT_ADDRESSES.Oracle[chainId]!]: OracleAbi__factory.abi as any,
          [CONTRACT_ADDRESSES.CompositePostRebaseBeaconReceiver[chainId]!]:
            CompositePostRebaseBeaconReceiverAbi__factory.abi as any,
          [CONTRACT_ADDRESSES.DepositSecurityModule[chainId]!]:
            DepositSecurityModuleAbi__factory.abi as any,
        }),
      ),
    `evm-script-decoder-${chainId}`,
  )
}
