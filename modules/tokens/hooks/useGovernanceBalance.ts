import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { ContractGovernanceToken } from 'modules/blockChain/contracts'
import { useLidoSWR } from '@lido-sdk/react'
import { CHAINS } from '@lido-sdk/constants'
import { MiniMeTokenAbi } from 'generated'
import { formatToken } from '../utils/formatToken'

export function useGovernanceBalance() {
  const { walletAddress, chainId } = useWeb3()
  const governanceToken = ContractGovernanceToken.useRpc()

  return useLidoSWR(
    walletAddress
      ? ['swr:useGovernanceBalance', chainId, governanceToken, walletAddress]
      : null,
    async (
      _key: string,
      _chainId: CHAINS,
      governanceTokenContract: MiniMeTokenAbi,
      _walletAddress: string,
    ) => {
      const governanceBalance = await governanceTokenContract.balanceOf(
        _walletAddress,
      )
      const governanceSymbol = await governanceTokenContract.symbol()
      const governanceBalanceStr = formatToken(
        governanceBalance,
        governanceSymbol,
      )

      return { governanceBalance, governanceSymbol, governanceBalanceStr }
    },
  )
}
