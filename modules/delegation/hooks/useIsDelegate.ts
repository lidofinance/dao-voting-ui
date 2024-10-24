import { CHAINS } from '@lido-sdk/constants'
import { useLidoSWR } from '@lido-sdk/react'
import { ContractVoting } from 'modules/blockChain/contracts'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

export const useIsDelegate = () => {
  const { chainId, walletAddress } = useWeb3()
  const votingContract = ContractVoting.useRpc()

  return useLidoSWR(
    walletAddress ? [`swr:useIsDelegate`, chainId, walletAddress] : null,
    async (_key: string, _chainId: CHAINS, _walletAddress: string) => {
      const delegatorsCount = await votingContract.getDelegatedVotersCount(
        _walletAddress,
      )

      return delegatorsCount.gt(0)
    },
  )
}
