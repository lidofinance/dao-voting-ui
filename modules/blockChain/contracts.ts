import { createContractHelpers } from './utils/createContractHelpers'
import {
  GovernanceTokenAbi__factory,
  AragonVotingAbi__factory,
  SnapshotAbi__factory,
  DualGovernanceAbi__factory,
  StethAbi__factory,
  EmergencyProtectedTimelockAbi__factory,
} from 'generated'
import * as CONTRACT_ADDRESSES from './contractAddresses'

export const ContractVoting = createContractHelpers({
  factory: AragonVotingAbi__factory,
  address: CONTRACT_ADDRESSES.AragonVoting,
})

export const ContractGovernanceToken = createContractHelpers({
  factory: GovernanceTokenAbi__factory,
  address: CONTRACT_ADDRESSES.GovernanceToken,
})

export const ContractSnapshot = createContractHelpers({
  factory: SnapshotAbi__factory,
  address: CONTRACT_ADDRESSES.Snapshot,
})

export const ContractDualGovernance = createContractHelpers({
  factory: DualGovernanceAbi__factory,
  address: CONTRACT_ADDRESSES.DualGovernance,
})

export const ContractStEth = createContractHelpers({
  factory: StethAbi__factory,
  address: CONTRACT_ADDRESSES.Steth,
})

export const ContractEmergencyProtectedTimelock = createContractHelpers({
  factory: EmergencyProtectedTimelockAbi__factory,
  address: CONTRACT_ADDRESSES.EmergencyProtectedTimelock,
})
