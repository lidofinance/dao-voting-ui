import { ContractGovernanceToken } from 'modules/contracts/contractHelpers'

export function useGovernanceSymbol() {
  return ContractGovernanceToken.useSwrRpc('symbol', [])
}
