import { ContractGovernanceToken } from 'modules/blockChain/contracts'

export function useGovernanceSymbol() {
  return ContractGovernanceToken.useSwrRpc('symbol', [])
}
