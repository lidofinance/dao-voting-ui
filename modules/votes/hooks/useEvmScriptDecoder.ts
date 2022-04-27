import { useGlobalMemo } from 'modules/shared/hooks/useGlobalMemo'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import { EVMScriptDecoder } from 'evm-script-decoder/lib/EVMScriptDecoder'
import { ABIProviderLocal } from 'evm-script-decoder/lib/ABIProviderLocal'

import {
  FinanceAbi__factory,
  MiniMeTokenAbi__factory,
  NodeOperatorsRegistryAbi__factory,
  TokenManagerAbi__factory,
  VotingAbi__factory,
} from 'generated'
import * as CONTRACT_ADDRESSES from 'modules/blockChain/contractAddresses'

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
        }),
      ),
    `evm-script-decoder-${chainId}`,
  )
}
