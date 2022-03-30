import { ContractGovernanceToken } from 'modules/blockChain/contracts'

export function useGovernanceTotalSupply() {
  return ContractGovernanceToken.useSwrRpc('totalSupply', [])
}
