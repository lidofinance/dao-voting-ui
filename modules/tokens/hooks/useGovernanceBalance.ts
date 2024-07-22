import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { ContractGovernanceToken } from 'modules/blockChain/contracts'
import { useLidoSWRImmutable } from '@lido-sdk/react'
import { CHAINS } from '@lido-sdk/constants'
import { formatToken } from '../utils/formatToken'

export function useGovernanceBalance() {
  const { walletAddress, chainId } = useWeb3()
  const governanceToken = ContractGovernanceToken.useRpc()

  return useLidoSWRImmutable(
    walletAddress ? ['swr:useGovernanceBalance', chainId, walletAddress] : null,
    async (_key: string, _chainId: CHAINS, _walletAddress: string) => {
      const balance = await governanceToken.balanceOf(_walletAddress)
      const symbol = await governanceToken.symbol()
      const balanceStr = formatToken(balance, symbol)

      return { balance, symbol, balanceStr }
    },
  )
}
