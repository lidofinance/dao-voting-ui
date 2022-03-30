import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { ContractGovernanceToken } from 'modules/blockChain/contracts'

export function useGovernanceBalance() {
  const { walletAddress } = useWeb3()
  return ContractGovernanceToken.useSwrWeb3(
    walletAddress ? 'balanceOf' : null,
    [String(walletAddress)],
  )
}
