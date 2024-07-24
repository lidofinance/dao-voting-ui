import { CHAINS } from '@lido-sdk/constants'
import { useLidoSWR } from '@lido-sdk/react'
import { ContractVoting } from 'modules/blockChain/contracts'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { DELEGATORS_PAGE_SIZE } from '../constants'

export function useDelegatorsPaginatedList(pageNumber: number) {
  const { walletAddress, chainId } = useWeb3()
  const voting = ContractVoting.useRpc()

  return useLidoSWR(
    walletAddress
      ? [`swr:useDelegatorsPaginatedList`, chainId, walletAddress, pageNumber]
      : null,
    async (
      _key: string,
      _chainId: CHAINS,
      _walletAddress: string,
      _pageNumber: number,
    ) => {
      const delegatorsCount = (
        await voting.getDelegatedVotersCount(_walletAddress)
      ).toNumber()

      if (delegatorsCount === 0) {
        return []
      }

      const delegators = await voting.getDelegatedVoters(
        _walletAddress,
        _pageNumber * DELEGATORS_PAGE_SIZE,
        DELEGATORS_PAGE_SIZE,
      )

      if (delegators.length === 0) {
        return []
      }

      const delegatorsBalances = await voting.getVotingPowerMultiple(delegators)

      return delegators.map((delegator, index) => ({
        address: delegator,
        balance: delegatorsBalances[index],
      }))
    },
  )
}
