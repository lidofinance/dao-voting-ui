import { createContractHelpers } from 'modules/blockChain/utils/createContractHelpers'
import {
  AragonVotingAbi__factory,
  DualGovernanceAbi__factory,
  EmergencyProtectedTimelockAbi__factory,
  GovernanceTokenAbi__factory,
  SnapshotAbi__factory,
  StethAbi__factory,
} from 'generated'
import { useConfig } from 'modules/config/hooks/useConfig'
import { useGlobalMemo } from 'modules/shared/hooks/useGlobalMemo'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useGetContractAddress } from './useGetContractAddress'

export const useContractHelpers = () => {
  const { chainId } = useWeb3()
  const { savedConfig, getRpcUrl } = useConfig()
  const getContractAddress = useGetContractAddress()

  return useGlobalMemo(() => {
    const rpcUrl = getRpcUrl(chainId)

    return {
      votingHelpers: createContractHelpers({
        factory: AragonVotingAbi__factory,
        address: getContractAddress('AragonVoting'),
        rpcUrl,
      }),
      ldoHelpers: createContractHelpers({
        factory: GovernanceTokenAbi__factory,
        address: getContractAddress('GovernanceToken'),
        rpcUrl,
      }),
      snapshotHelpers: createContractHelpers({
        factory: SnapshotAbi__factory,
        address: getContractAddress('Snapshot'),
        rpcUrl,
      }),
      dualGovernanceHelpers: createContractHelpers({
        factory: DualGovernanceAbi__factory,
        address: getContractAddress('DualGovernance'),
        rpcUrl,
      }),
      stEthHelpers: createContractHelpers({
        factory: StethAbi__factory,
        address: getContractAddress('Steth'),
        rpcUrl,
      }),
      emergencyProtectedTimelockHelpers: createContractHelpers({
        factory: EmergencyProtectedTimelockAbi__factory,
        address: getContractAddress('EmergencyProtectedTimelock'),
        rpcUrl,
      }),
    }
  }, `contracts-${chainId}-${savedConfig.useTestContracts ? 'test' : 'actual'}`)
}
