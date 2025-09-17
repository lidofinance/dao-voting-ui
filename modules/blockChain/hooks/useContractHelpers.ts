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
  const { savedConfig } = useConfig()
  const getContractAddress = useGetContractAddress()

  return useGlobalMemo(() => {
    return {
      votingHelpers: createContractHelpers({
        factory: AragonVotingAbi__factory,
        address: getContractAddress('AragonVoting'),
      }),
      ldoHelpers: createContractHelpers({
        factory: GovernanceTokenAbi__factory,
        address: getContractAddress('GovernanceToken'),
      }),
      snapshotHelpers: createContractHelpers({
        factory: SnapshotAbi__factory,
        address: getContractAddress('Snapshot'),
      }),
      dualGovernanceHelpers: createContractHelpers({
        factory: DualGovernanceAbi__factory,
        address: getContractAddress('DualGovernance'),
      }),
      stEthHelpers: createContractHelpers({
        factory: StethAbi__factory,
        address: getContractAddress('Steth'),
      }),
      emergencyProtectedTimelockHelpers: createContractHelpers({
        factory: EmergencyProtectedTimelockAbi__factory,
        address: getContractAddress('EmergencyProtectedTimelock'),
      }),
    }
  }, `contracts-${chainId}-${savedConfig.useTestContracts ? 'test' : 'actual'}`)
}
