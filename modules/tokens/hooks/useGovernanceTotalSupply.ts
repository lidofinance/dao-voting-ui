import { ContractGovernanceToken } from 'modules/contracts/contractHelpers'

export function useGovernanceTotalSupply() {
  return ContractGovernanceToken.useSwrRpc('totalSupply', [])
}
