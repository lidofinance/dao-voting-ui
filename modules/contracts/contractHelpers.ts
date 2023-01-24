import { createContractHelpers } from './utils/createContractHelpers'
import { MiniMeTokenAbi__factory, VotingAbi__factory } from 'generated'
import { CONTRACT_ADDRESSES } from './contractAddresses'

export const ContractVoting = createContractHelpers({
  factory: VotingAbi__factory,
  address: CONTRACT_ADDRESSES.Voting,
})

export const ContractGovernanceToken = createContractHelpers({
  factory: MiniMeTokenAbi__factory,
  address: CONTRACT_ADDRESSES.GovernanceToken,
})
