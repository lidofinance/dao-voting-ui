import { useLidoSWRImmutable } from '@lido-sdk/react'
import { BigNumber } from 'ethers'
import { ContractVoting } from 'modules/blockChain/contracts'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { DELEGATORS_FETCH_TOTAL } from 'modules/delegation/constants'
import { PUBLIC_DELEGATES } from 'modules/delegation/publicDelegates'
import { useEnsResolvers } from 'modules/shared/hooks/useEnsResolvers'
import { isValidEns } from 'modules/shared/utils/addressValidation'

export const useProcessedPublicDelegatesList = () => {
  const { chainId } = useWeb3()
  const voting = ContractVoting.useRpc()

  const { resolveName } = useEnsResolvers()

  return useLidoSWRImmutable(
    [`swr:useProcessedPublicDelegatesList`, chainId],
    async () => {
      const parsedList = await Promise.all(
        PUBLIC_DELEGATES.map(async delegate => {
          let delegateAddress: string | null = delegate.address

          // If `address` was provided as ENS name, convert it to address
          if (isValidEns(delegateAddress)) {
            delegateAddress = await resolveName(delegateAddress)

            // If ENS name wasn't not resolved, return delegate with N/A values
            if (!delegateAddress) {
              return {
                ...delegate,
                delegatorsCount: 'N/A',
                delegatedVotingPower: 'N/A',
              }
            }
          }

          const delegatorsCount = await voting.getDelegatedVotersCount(
            delegateAddress,
          )

          if (delegatorsCount.isZero()) {
            return {
              ...delegate,
              delegatorsCount: '0',
              delegatedVotingPower: '0',
            }
          }

          const delegatorsAddresses = await voting.getDelegatedVoters(
            delegateAddress,
            0,
            DELEGATORS_FETCH_TOTAL,
          )
          console.log('addresses', delegatorsAddresses)
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
          }
        }),
      )

      return parsedList.sort((a, b) => {
        if (typeof a.delegatedVotingPower === 'string') {
          return 1
        }
        if (a.delegatedVotingPower.lt(b.delegatedVotingPower)) {
          return 1
        }
        if (a.delegatedVotingPower.gt(b.delegatedVotingPower)) {
          return -1
        }
        return 0
      })
    },
  )
}
