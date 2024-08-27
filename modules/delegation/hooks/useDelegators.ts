import { CHAINS } from '@lido-sdk/constants'
import { useLidoSWR } from '@lido-sdk/react'
import { ContractVoting } from 'modules/blockChain/contracts'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { DELEGATORS_FETCH_SIZE, DELEGATORS_FETCH_TOTAL } from '../constants'
import { BigNumber } from 'ethers'

type DelegatorData = { address: string; balance: BigNumber }

type DelegatorsData = {
  nonZeroDelegators: DelegatorData[]
  totalVotingPower: BigNumber
  notFetchedDelegatorsCount: number
}

/*
  SWR data hook to fetch first N delegators of the current wallet address.
  Returns up to DELEGATORS_FETCH_TOTAL delegators with their voting power.
  The list contains only delegators with voting power greater than 0.
*/
export function useDelegators() {
  const { walletAddress, chainId } = useWeb3()
  const voting = ContractVoting.useRpc()

  const { data, initialLoading, loading, error } = useLidoSWR<DelegatorsData>(
    walletAddress ? [`swr:useDelegators`, chainId, walletAddress] : null,
    async (_key: string, _chainId: CHAINS, _walletAddress: string) => {
      const totalDelegatorsCount = (
        await voting.getDelegatedVotersCount(_walletAddress)
      ).toNumber()

      if (totalDelegatorsCount === 0) {
        return {
          nonZeroDelegators: [] as DelegatorData[],
          totalVotingPower: BigNumber.from(0),
          notFetchedDelegatorsCount: 0,
        }
      }

      const fetchLimit = Math.min(totalDelegatorsCount, DELEGATORS_FETCH_TOTAL)
      const fetchCount = Math.ceil(fetchLimit / DELEGATORS_FETCH_SIZE)
      const fetchNumbers = Array(fetchCount).fill(0)

      const delegators: DelegatorData[] = []
      let totalVotingPower = BigNumber.from(0)

      await Promise.all(
        fetchNumbers.map(async (_, fetchIndex) => {
          const delegatorsAtPage = await voting.getDelegatedVoters(
            _walletAddress,
            fetchIndex * DELEGATORS_FETCH_SIZE,
            DELEGATORS_FETCH_SIZE,
          )

          if (delegatorsAtPage.length === 0) {
            return
          }

          const delegatorsAtPageBalances = await voting.getVotingPowerMultiple(
            delegatorsAtPage,
          )

          delegatorsAtPage.forEach((delegator, index) => {
            delegators.push({
              address: delegator,
              balance: delegatorsAtPageBalances[index],
            })
            totalVotingPower = totalVotingPower.add(
              delegatorsAtPageBalances[index],
            )
          })
        }),
      )

      const nonZeroDelegators = delegators.filter(delegator =>
        delegator.balance.gt(0),
      )

      return {
        nonZeroDelegators,
        totalVotingPower,
        notFetchedDelegatorsCount: totalDelegatorsCount - delegators.length,
      }
    },
  )

  return {
    data: {
      nonZeroDelegators: data?.nonZeroDelegators ?? [],
      totalVotingPower: data?.totalVotingPower ?? BigNumber.from(0),
      notFetchedDelegatorsCount: data?.notFetchedDelegatorsCount ?? 0,
    } as DelegatorsData,
    initialLoading,
    loading,
    error,
  }
}
