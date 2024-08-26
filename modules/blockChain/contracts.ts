import { createContractHelpers } from './utils/createContractHelpers'
import {
  MiniMeTokenAbi__factory,
  AragonVotingAbi__factory,
  SnapshotAbi__factory,
} from 'generated'
import * as CONTRACT_ADDRESSES from './contractAddresses'

export const ContractVoting = createContractHelpers({
  factory: AragonVotingAbi__factory,
  address: CONTRACT_ADDRESSES.AragonVoting,
})

export const ContractGovernanceToken = createContractHelpers({
  factory: MiniMeTokenAbi__factory,
  address: CONTRACT_ADDRESSES.GovernanceToken,
})

export const ContractSnapshot = createContractHelpers({
  factory: SnapshotAbi__factory,
  address: CONTRACT_ADDRESSES.Snapshot,
})
