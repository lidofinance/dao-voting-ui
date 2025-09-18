import React, { useCallback, useEffect, useMemo, useState } from 'react'
import * as urls from 'modules/network/utils/urls'
import { Button, Link, Modal, Success, Text } from '@lidofinance/lido-ui'

import CheckSVG from 'assets/check.com.svg.react'
import CrossSVG from 'assets/cross.com.svg.react'

import { DelegatorsList } from 'modules/votes/ui/VoteActionsModals/DelegatorsList/VoteActionsDelegatorsList'

import { useVoteFormActionsContext } from 'modules/votes/providers/VoteFormActions/VoteFormActionsContext'
import { formatBalance } from 'modules/blockChain/utils/formatBalance'
import { ButtonGroup } from 'modules/votes/ui/VoteActionsModals/SubmitModal/VoteSubmitModalStyle'
import { BigNumber } from '@ethersproject/bignumber'
import { VotePhase, VoterState } from 'modules/votes/types'

import {
  DelegateCtaWrap,
  ExtraVotingWrap,
  InlineButtonGroup,
  LinkWrap,
  TxStatusWrapper,
  VoteButtonStyled,
} from './VoteSuccessModalStyle'
import { TxRow } from 'modules/blockChain/ui/TxRow'
import { openWindow } from 'modules/shared/utils/openWindow'
import { VoteActionButtonObjectionTooltip } from 'modules/votes/ui/VoteActionButtonObjectionTooltip'
import { ModalProps } from 'modules/modal/ModalProvider'
import { useEtherscanOpener } from 'modules/blockChain/hooks/useEtherscanOpener'

export function VoteSuccessModal(props: ModalProps<{}>) {
  const {
    txVote,
    txDelegatesVote,
    eligibleDelegatedVoters,
    delegatorsVotedThemselves,
    governanceSymbol,
    eligibleDelegatedVotingPower,
    delegatedVotersAddresses,
    voteEvents,
    mode,
    votedByDelegate,
    handleVote,
    handleDelegatesVote,
    votePower,
    delegationInfo,
    votePhase,
    successData,
    voterState,
    setSuccessData,
  } = useVoteFormActionsContext()

  useEffect(() => {
    return () => {
      // Clear success data on modal close
      setSuccessData(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [selectedDelegatedAddresses, setSelectedDelegatedAddresses] = useState<
    string[]
  >([])

  const handleSelectedAddressesChange = useCallback((addresses: string[]) => {
    setSelectedDelegatedAddresses(addresses)
  }, [])

  const votedAsLog = useMemo(() => successData?.votedAsLog || [], [successData])

  const hasVotedWithOwnVP =
    votedAsLog.includes('owner') ||
    voterState === VoterState.Nay ||
    voterState === VoterState.Yea
  const hasVotedAsDelegate = votedAsLog.includes('delegate')
  const hasVotedBothWays = hasVotedWithOwnVP && hasVotedAsDelegate

  const hasDelegators = useMemo(
    () => delegatedVotersAddresses.length > 0,
    [delegatedVotersAddresses],
  )

  const showDelegateCta = useMemo(
    () =>
      hasVotedWithOwnVP &&
      !hasDelegators &&
      !delegationInfo?.aragonDelegateAddress,
    [hasVotedWithOwnVP, hasDelegators, delegationInfo],
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

  const handleVoteClick = useCallback(
    (power: 'own' | 'delegated') => {
      if (!mode) return
      if (power === 'own') {
        return handleVote(mode)
      }
      return handleDelegatesVote(mode, selectedDelegatedAddresses)
    },
    [mode, handleVote, handleDelegatesVote, selectedDelegatedAddresses],
  )

  const handleCtaClick = useCallback(() => openWindow(urls.delegation), [])

  const canVoteWithDelegatedPower =
    hasVotedWithOwnVP &&
    eligibleDelegatedVoters.length - votedByDelegate.length > 0

  const canVoteWithOwnPower =
    votePower !== undefined && votePower > 0 && !hasVotedWithOwnVP

  const lastTxHash = useMemo(() => {
    const { tx } =
      votedAsLog[votedAsLog.length - 1] === 'owner' ? txVote : txDelegatesVote
    if (tx?.type === 'safe') {
      return ''
    }
    return tx?.tx.hash ?? ''
  }, [txDelegatesVote, txVote, votedAsLog])

  const handleEtherscan = useEtherscanOpener(lastTxHash, 'tx')

  const canVoteWithDelegatedPowerOnly = useMemo(
    () => !canVoteWithOwnPower && canVoteWithDelegatedPower,
    [canVoteWithOwnPower, canVoteWithDelegatedPower],
  )

  const voteOption = useMemo(() => {
    return mode === 'yay' ? '“Yes”' : '“No”'
  }, [mode])

  const shouldShowAdditionalCta =
    !hasVotedBothWays && (canVoteWithDelegatedPower || canVoteWithOwnPower)

  const extraVotingTitle = useMemo(() => {
    if (canVoteWithDelegatedPowerOnly) {
      return `Vote as a delegate`
    }
    return `Vote ${voteOption} with`
  }, [canVoteWithDelegatedPowerOnly, voteOption])

  if (votedAsLog.length === 0) {
    return null
  }

  return (
    <Modal
      title={`You voted ${voteOption}${
        votedAsLog[votedAsLog.length - 1] === 'delegate' ? ' as a delegate' : ''
      }`}
      center
      {...props}
      titleIcon={<Success color="green" height={64} width={64} />}
    >
      {lastTxHash && (
        <LinkWrap>
          <Text size="xs" color="secondary">
            Transaction can be viewed on
          </Text>
          <Link onClick={handleEtherscan}>Etherscan</Link>
        </LinkWrap>
      )}
      {shouldShowAdditionalCta && (
        <>
          <ExtraVotingWrap>
            <Text size="sm" strong>
              {extraVotingTitle}
            </Text>
            {canVoteWithDelegatedPowerOnly ? (
              <>
                <InlineButtonGroup>
                  <VoteButtonStyled
                    size="xs"
                    color="secondary"
                    onClick={() =>
                      handleDelegatesVote('nay', selectedDelegatedAddresses)
                    }
                  >
                    {<CrossSVG />} No
                  </VoteButtonStyled>
                  {votePhase === VotePhase.Objection ? (
                    <VoteActionButtonObjectionTooltip>
                      <VoteButtonStyled size="xs" color="secondary" disabled>
                        {<CheckSVG />} Yes
                      </VoteButtonStyled>
                    </VoteActionButtonObjectionTooltip>
                  ) : (
                    <VoteButtonStyled
                      size="xs"
                      color="secondary"
                      onClick={() =>
                        handleDelegatesVote('yay', selectedDelegatedAddresses)
                      }
                    >
                      {<CheckSVG />} Yes
                    </VoteButtonStyled>
                  )}
                </InlineButtonGroup>
                {!txDelegatesVote.isEmpty && (
                  <TxStatusWrapper>
                    <TxRow
                      tx={txDelegatesVote}
                      onClick={txDelegatesVote.open}
                    />
                  </TxStatusWrapper>
                )}
              </>
            ) : (
              <ButtonGroup>
                {canVoteWithOwnPower && (
                  <Button
                    color="secondary"
                    size="sm"
                    onClick={() => handleVoteClick('own')}
                    loading={txVote.isPending}
                    disabled={!txVote.isEmpty && txVote.tx?.type === 'safe'}
                  >
                    My own ({votePower} {governanceSymbol})
                  </Button>
                )}
                {!txVote.isEmpty && canVoteWithOwnPower && (
                  <TxStatusWrapper>
                    <TxRow tx={txVote} onClick={txVote.open} />
                  </TxStatusWrapper>
                )}
                {canVoteWithDelegatedPower && (
                  <Button
                    color="secondary"
                    size="sm"
                    loading={txDelegatesVote.isPending}
                    onClick={() => handleVoteClick('delegated')}
                  >
                    Delegated ({formatBalance(selectedBalance)}{' '}
                    {governanceSymbol})
                  </Button>
                )}
                {!txDelegatesVote.isEmpty && canVoteWithDelegatedPower && (
                  <TxStatusWrapper>
                    <TxRow
                      tx={txDelegatesVote}
                      onClick={txDelegatesVote.open}
                    />
                  </TxStatusWrapper>
                )}
              </ButtonGroup>
            )}
            {canVoteWithDelegatedPower && (
              <>
                <DelegatorsList
                  defaultExpanded={false}
                  eligibleDelegatedVoters={eligibleDelegatedVoters}
                  delegatorsVotedThemselves={delegatorsVotedThemselves}
                  governanceSymbol={governanceSymbol}
                  eligibleDelegatedVotingPower={eligibleDelegatedVotingPower}
                  onSelectedAddressesChange={handleSelectedAddressesChange}
                  voteEvents={voteEvents}
                />
              </>
            )}
          </ExtraVotingWrap>
        </>
      )}
      {showDelegateCta && (
        <ExtraVotingWrap>
          <DelegateCtaWrap>
            <Text size="sm" strong>
              You can Delegate
            </Text>
            <ul>
              <li>You delegate only the right to vote, not ownership,</li>
              <li>You can always override the delegate&apos;s choice,</li>
              <li>You can revoke delegation at any time.</li>
            </ul>
            <Button color="primary" size="sm" onClick={handleCtaClick}>
              Delegate
            </Button>
          </DelegateCtaWrap>
        </ExtraVotingWrap>
      )}
    </Modal>
  )
}
