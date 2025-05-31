import React, { useCallback, useMemo, useState } from 'react'

import { Button, Modal, ModalProps } from '@lidofinance/lido-ui'
import {
  ButtonGroup,
  TxStatusWrapper,
} from 'modules/votes/ui/VoteActionsModals/SubmitModal/VoteSubmitModalStyle'
import { DelegatorsList } from 'modules/votes/ui/VoteActionsModals/DelegatorsList/VoteActionsDelegatorsList'
import { formatBalance } from 'modules/blockChain/utils/formatBalance'
import { useVoteFormActionsContext } from 'modules/votes/providers/VoteFormActions/VoteFormActionsContext'
import { TxRow } from 'modules/blockChain/ui/TxRow'
import { BigNumber } from '@ethersproject/bignumber'

export function VoteSubmitModal({ data: { mode }, ...modalProps }: ModalProps) {
  const {
    handleVote,
    handleDelegatesVote,
    txDelegatesVote,
    eventsVoted,
    eligibleDelegatedVotingPower,
    delegatorsVotedThemselves,
    eligibleDelegatedVoters,
    governanceSymbol,
  } = useVoteFormActionsContext()

  const [selectedDelegatedAddresses, setSelectedDelegatedAddresses] = useState<
    string[]
  >([])

  const handleSelectedAddressesChange = useCallback(addresses => {
    setSelectedDelegatedAddresses(addresses)
  }, [])

  const handleVoteClick = useCallback(
    power => {
      if (power === 'own') {
        return handleVote(mode)
      }
      return handleDelegatesVote(mode, selectedDelegatedAddresses)
    },
    [mode, handleVote, handleDelegatesVote, selectedDelegatedAddresses],
  )

  const selectedBalance = useMemo(
    () =>
      eligibleDelegatedVoters
        .filter(delegator =>
          selectedDelegatedAddresses.includes(delegator.address),
        )
        .reduce(
          (acc: BigNumber, delegator) =>
            acc.add(BigNumber.from(delegator.votingPower)),
          BigNumber.from(0),
        ),
    [selectedDelegatedAddresses, eligibleDelegatedVoters],
  )

  const canVoteWithDelegatedPower = eligibleDelegatedVoters.length > 0

  const title = `Vote ${mode === 'yay' ? '“Yes”' : '“No”'} with Delegated VP`

  return (
    <Modal title={title} center {...modalProps}>
      <ButtonGroup>
        {canVoteWithDelegatedPower && (
          <Button
            color="secondary"
            size="sm"
            onClick={() => handleVoteClick('delegated')}
            loading={txDelegatesVote.isPending}
          >
            Delegated ({formatBalance(selectedBalance)} {governanceSymbol})
          </Button>
        )}
      </ButtonGroup>
      {!txDelegatesVote.isEmpty && canVoteWithDelegatedPower && (
        <TxStatusWrapper>
          <TxRow tx={txDelegatesVote} onClick={txDelegatesVote.open} />
        </TxStatusWrapper>
      )}
      {canVoteWithDelegatedPower && (
        <DelegatorsList
          defaultExpanded={false}
          eligibleDelegatedVoters={eligibleDelegatedVoters}
          delegatorsVotedThemselves={delegatorsVotedThemselves}
          governanceSymbol={governanceSymbol}
          eligibleDelegatedVotingPower={eligibleDelegatedVotingPower}
          onSelectedAddressesChange={handleSelectedAddressesChange}
          eventsVoted={eventsVoted}
        />
      )}
    </Modal>
  )
}
