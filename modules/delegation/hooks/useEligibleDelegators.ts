import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { BigNumber } from 'ethers'
import { ContractVoting } from 'modules/blockChain/contracts'
import { useLidoSWR } from '@lido-sdk/react'
import { CHAINS } from '@lido-sdk/constants'
import { VoterState } from 'modules/votes/types'
import {
  DELEGATED_VOTERS_ADDRESSES_LIMIT,
  ZERO_BN,
} from 'modules/delegation/constants'

type Args = {
  voteId: string
}

export interface EligibleDelegator {
  address: string
  votingPower: BigNumber
  votedByDelegate: boolean
}

export interface EligibleDelegatorsData {
  delegatedVotersAddresses: string[]
  eligibleDelegatedVotingPower: BigNumber
  delegatedVotersState: VoterState[]
  eligibleDelegatedVoters: EligibleDelegator[]
  eligibleDelegatedVotersAddresses: string[]
}

type ChainId = CHAINS

function processEligibleDelegators(
  addresses: string[],
  votingPowers: BigNumber[],
  voterStates: VoterState[],
): {
  eligibleDelegatedVoters: EligibleDelegator[]
  eligibleDelegatedVotingPower: BigNumber
} {
  return addresses.reduce(
    (acc, address, index) => {
      const votingPower = votingPowers[index]
      const voterState = voterStates[index]

      if (
        votingPower.gt(ZERO_BN) &&
        voterState !== VoterState.Yea &&
        voterState !== VoterState.Nay
      ) {
        const delegator: EligibleDelegator = {
          address,
          votingPower,
          votedByDelegate:
            voterState === VoterState.DelegateNay ||
            voterState === VoterState.DelegateYea,
        }

        acc.eligibleDelegatedVoters.push(delegator)
        acc.eligibleDelegatedVotingPower =
          acc.eligibleDelegatedVotingPower.add(votingPower)
      }

      return acc
    },
    {
      eligibleDelegatedVoters: [] as EligibleDelegator[],
      eligibleDelegatedVotingPower: BigNumber.from(0),
    },
  )
}

export function useEligibleDelegators({ voteId }: Args) {
  const { walletAddress, chainId } = useWeb3()
  const voting = ContractVoting.useRpc()

  const swrResult = useLidoSWR(
    walletAddress && voteId
      ? ['swr:useEligibleDelegators', voteId, chainId, walletAddress]
      : null,
    async (
      _key: string,
      _voteId: string,
      _chainId: ChainId,
      _walletAddress: string,
    ) => {
      try {
        const delegatedVotersAddresses = await voting.getDelegatedVoters(
          _walletAddress,
          0,
          DELEGATED_VOTERS_ADDRESSES_LIMIT,
        )

        const delegatedVotersVotingPower =
          await voting.getVotingPowerMultipleAtVote(
            _voteId,
            delegatedVotersAddresses,
          )

        const delegatedVotersState = await voting.getVoterStateMultipleAtVote(
          _voteId,
          delegatedVotersAddresses,
        )

        const { eligibleDelegatedVoters, eligibleDelegatedVotingPower } =
          processEligibleDelegators(
            delegatedVotersAddresses,
            delegatedVotersVotingPower,
            delegatedVotersState,
          )

        const eligibleDelegatedVotersAddresses = eligibleDelegatedVoters.map(
          ({ address }) => address,
        )

        return {
          delegatedVotersAddresses,
          eligibleDelegatedVotingPower,
          delegatedVotersState,
          eligibleDelegatedVoters,
          eligibleDelegatedVotersAddresses,
        }
      } catch (error) {
        console.error('Error in useEligibleDelegators:', error)
        throw error
      }
    },
  )

  return {
    data: {
      delegatedVotersAddresses: swrResult.data?.delegatedVotersAddresses || [],
      eligibleDelegatedVotingPower:
        swrResult.data?.eligibleDelegatedVotingPower || BigNumber.from(0),
      delegatedVotersState: swrResult.data?.delegatedVotersState || [],
      eligibleDelegatedVoters: swrResult.data?.eligibleDelegatedVoters || [],
      eligibleDelegatedVotersAddresses:
        swrResult.data?.eligibleDelegatedVotersAddresses || [],
    },
    mutate: swrResult.mutate,
  }
}
