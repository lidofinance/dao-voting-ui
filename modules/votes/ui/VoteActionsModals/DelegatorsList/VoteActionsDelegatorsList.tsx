import React, { useMemo, useEffect, useCallback } from 'react'
import { Text, Checkbox, trimAddress, ToastInfo } from '@lidofinance/lido-ui'
import {
  AccordionWrap,
  DelegatorsListItem,
  ListWrap,
  VotedByHolderWrap,
  AddressWrap,
  SummaryWrap,
  SummaryAmount,
  DelegatorsVotingPower,
} from 'modules/votes/ui/VoteActionsModals/DelegatorsList/VoteActionsDelegatorsListStyle'
import { AddressBadgeWrap } from 'modules/delegation/ui/DelegatorsList/DelegatorsListStyle'
import { AddressPop } from 'modules/shared/ui/Common/AddressPop'
import { formatBalance } from 'modules/blockChain/utils/formatBalance'
import { useSimpleReducer } from 'modules/shared/hooks/useSimpleReducer'
import { BigNumber } from 'ethers'
import { EligibleDelegator } from 'modules/delegation/hooks/useEligibleDelegators'
import { CastVoteEventObject } from 'generated/AragonVotingAbi'

interface Props {
  delegatorsVotedThemselves: CastVoteEventObject[] | undefined
  governanceSymbol: string | undefined
  onSelectedAddressesChange: (address: string[]) => void
  eventsVoted: CastVoteEventObject[] | undefined
  eligibleDelegatedVoters: EligibleDelegator[]
  eligibleDelegatedVotingPower: BigNumber
  defaultExpanded: boolean
}

const pluralize = (count: number, noun: string, suffix = 's') =>
  `${count} ${noun}${count !== 1 ? suffix : ''}`

export function DelegatorsList({
  eligibleDelegatedVoters,
  delegatorsVotedThemselves,
  governanceSymbol,
  eligibleDelegatedVotingPower,
  onSelectedAddressesChange,
  eventsVoted,
  defaultExpanded,
}: Props) {
  const TRANSACTION_LIMIT = 100

  const initialCheckedItems = useMemo(
    () =>
      Object.fromEntries(
        eligibleDelegatedVoters
          .filter(delegator => !delegator.votedByDelegate)
          .map((delegator, index) => [
            delegator.address,
            Boolean(index < TRANSACTION_LIMIT),
          ]),
      ),
    [eligibleDelegatedVoters],
  )

  const [checkedItems, dispatch] = useSimpleReducer(initialCheckedItems)

  const selectedAddresses = useMemo(
    () => Object.keys(checkedItems).filter(address => checkedItems[address]),
    [checkedItems],
  )

  const _eventsVoted = useMemo(() => {
    return eventsVoted?.reduce<Record<string, boolean>>((acc, event) => {
      acc[event.voter] = event.supports
      return acc
    }, {})
  }, [eventsVoted])

  useEffect(() => {
    onSelectedAddressesChange(selectedAddresses)
  }, [selectedAddresses, onSelectedAddressesChange])

  const selectedBalance = useMemo(
    () =>
      eligibleDelegatedVoters
        .filter(delegator => selectedAddresses.includes(delegator.address))
        .reduce(
          (acc: BigNumber, delegator) =>
            acc.add(BigNumber.from(delegator.votingPower)),
          BigNumber.from(0),
        ),
    [selectedAddresses, eligibleDelegatedVoters],
  )

  const handleCheckboxChange = useCallback(
    (address: string, isChecked: boolean) => {
      const currentCheckedCount = selectedAddresses.length

      if (isChecked && currentCheckedCount >= TRANSACTION_LIMIT) {
        ToastInfo('Transaction limit reached. Vote with the rest next.', {})
        return
      }

      dispatch({
        [address]: Boolean(isChecked),
      })
    },
    [selectedAddresses, TRANSACTION_LIMIT, dispatch],
  )

  function Summary() {
    return (
      <SummaryWrap>
        <Text size="xxs">Selected</Text>
        <SummaryAmount>
          <Text size="xxs" strong>
            {formatBalance(selectedBalance)} {governanceSymbol}
          </Text>{' '}
          <Text size="xxs">
            / {formatBalance(eligibleDelegatedVotingPower)}
            {governanceSymbol}
          </Text>
        </SummaryAmount>
        <Text size="xxs">
          from {pluralize(eligibleDelegatedVoters.length, 'delegate')}
        </Text>
      </SummaryWrap>
    )
  }

  return (
    <AccordionWrap defaultExpanded={defaultExpanded} summary={<Summary />}>
      <ListWrap>
        {eligibleDelegatedVoters.map(delegator => (
          <DelegatorsListItem key={delegator.address}>
            <AddressWrap>
              <Checkbox
                checked={Boolean(checkedItems[delegator.address])}
                onChange={e =>
                  handleCheckboxChange(delegator.address, e.target.checked)
                }
              />
              <AddressPop address={delegator.address}>
                <AddressBadgeWrap>
                  <Text as="span" size="xxs">
                    {trimAddress(delegator.address, 4)}
                  </Text>
                </AddressBadgeWrap>
              </AddressPop>
            </AddressWrap>
            {delegator.votedByDelegate && (
              <Text as="span" size="xxs">
                {_eventsVoted && _eventsVoted[delegator.address]
                  ? 'Yes (You)'
                  : 'No (You)'}
              </Text>
            )}
            <DelegatorsVotingPower>
              {formatBalance(delegator.votingPower)} {governanceSymbol}
            </DelegatorsVotingPower>
          </DelegatorsListItem>
        ))}
      </ListWrap>
      {delegatorsVotedThemselves && delegatorsVotedThemselves.length > 0 && (
        <>
          <VotedByHolderWrap>
            <Text size="xxs" color="secondary">
              Voted by holder
            </Text>
          </VotedByHolderWrap>
          <ListWrap>
            {delegatorsVotedThemselves.map(voteEvent => (
              <DelegatorsListItem key={voteEvent.voter}>
                <AddressPop address={voteEvent.voter}>
                  <AddressBadgeWrap>
                    <Text as="span" size="xxs">
                      {trimAddress(voteEvent.voter, 4)}
                    </Text>
                  </AddressBadgeWrap>
                </AddressPop>
                <span>{voteEvent.supports ? 'Yes' : 'No'}</span>
                <Text size="xs">
                  {formatBalance(voteEvent.stake)} {governanceSymbol}
                </Text>
              </DelegatorsListItem>
            ))}
          </ListWrap>
        </>
      )}
    </AccordionWrap>
  )
}
