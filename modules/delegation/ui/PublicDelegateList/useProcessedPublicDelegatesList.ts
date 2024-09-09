import { useLidoSWRImmutable } from '@lido-sdk/react'
import { BigNumber } from 'ethers'
import { ContractVoting } from 'modules/blockChain/contracts'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { DELEGATORS_FETCH_TOTAL } from 'modules/delegation/constants'
import { PUBLIC_DELEGATES } from 'modules/delegation/publicDelegates'
import { useEnsResolvers } from 'modules/shared/hooks/useEnsResolvers'
import {
  isValidAddress,
  isValidEns,
} from 'modules/shared/utils/addressValidation'

export type ProcessedDelegate = typeof PUBLIC_DELEGATES[number] & {
  delegatorsCount: string
  delegatedVotingPower: BigNumber | string
  resolvedDelegateAddress: string | null
}

export const useProcessedPublicDelegatesList = () => {
  const { chainId } = useWeb3()
  const voting = ContractVoting.useRpc()

  const { resolveName } = useEnsResolvers()

  return useLidoSWRImmutable<ProcessedDelegate[]>(
    [`swr:useProcessedPublicDelegatesList`, chainId],
    async () => {
      const parsedList: ProcessedDelegate[] = await Promise.all(
        PUBLIC_DELEGATES.map(async delegate => {
          let resolvedDelegateAddress: string | null =
            delegate.address.toLowerCase()

          // If `address` was provided as ENS name, convert it to address
          if (isValidEns(delegate.address)) {
            resolvedDelegateAddress =
              (await resolveName(delegate.address))?.toLowerCase() ?? null

            // If ENS name wasn't not resolved, return delegate with N/A values
            if (!resolvedDelegateAddress) {
              return {
                ...delegate,
                delegatorsCount: 'N/A',
                delegatedVotingPower: 'N/A',
                resolvedDelegateAddress: null,
              }
            }
          } else if (!isValidAddress(delegate.address)) {
            return {
              ...delegate,
              delegatorsCount: 'N/A',
              delegatedVotingPower: 'N/A',
              resolvedDelegateAddress: null,
            }
          }

          const delegatorsCount = await voting.getDelegatedVotersCount(
            resolvedDelegateAddress,
          )

          if (delegatorsCount.isZero()) {
            return {
              ...delegate,
              delegatorsCount: '0',
              delegatedVotingPower: BigNumber.from(0),
              resolvedDelegateAddress,
            }
          }

          const delegatorsAddresses = await voting.getDelegatedVoters(
            resolvedDelegateAddress,
            0,
            DELEGATORS_FETCH_TOTAL,
          )
          const delegatorsBalances = await voting.getVotingPowerMultiple(
            delegatorsAddresses,
          )
          const delegatedVotingPower = delegatorsBalances.reduce(
            (acc, balance) => acc.add(balance),
            BigNumber.from(0),
          )

          return {
            ...delegate,
            delegatorsCount: delegatorsCount.toString(),
            delegatedVotingPower: delegatedVotingPower,
            resolvedDelegateAddress,
          }
        }),
      )

      return parsedList.sort((a, b) => {
        if (typeof a.delegatedVotingPower === 'string') {
          return 1
        }
        if (typeof b.delegatedVotingPower === 'string') {
          return -1
        }
        if (a.delegatedVotingPower.lt(b.delegatedVotingPower)) {
          return 1
        }
        if (a.delegatedVotingPower.gt(b.delegatedVotingPower)) {
          return -1
        }

        return a.name.localeCompare(b.name)
      })
    },
    {
      onError: (error, key) => console.error(key, error),
    },
  )
}
