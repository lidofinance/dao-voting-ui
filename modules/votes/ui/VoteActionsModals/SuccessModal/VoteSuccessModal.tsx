import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as urls from 'modules/network/utils/urls'
import { Button, Link, Modal, Success, Text } from '@lidofinance/lido-ui'

import CheckSVG from 'assets/check.com.svg.react'
import CrossSVG from 'assets/cross.com.svg.react'

import { DelegatorsList } from 'modules/votes/ui/VoteActionsModals/DelegatorsList/VoteActionsDelegatorsList'

import {
  useVoteFormActionsContext,
  VotedAs,
} from 'modules/votes/providers/VoteFormActions/VoteFormActionsContext'
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
import { EligibleDelegator } from 'modules/delegation/hooks/useEligibleDelegators'
import { DelegationInfo } from 'modules/delegation/types'
import { ModalProps } from 'modules/modal/ModalProvider'
import { useEtherscanOpener } from 'modules/blockChain/hooks/useEtherscanOpener'

interface SnapshotData {
  mode: 'yay' | 'nay' | 'enact' | null
  eligibleDelegatedVotingPower: BigNumber
  votePhase: VotePhase | undefined
  votedByDelegate: EligibleDelegator[]
  votePower: number | undefined
  delegationInfo: DelegationInfo | undefined
  delegatedVotersAddresses: string[]
  eligibleDelegatedVoters: EligibleDelegator[]
  voterState: number | null | undefined
}

export function VoteSuccessModal({
  data: { successTx },
  ...modalProps
}: ModalProps<{
  data: { successTx?: { hash: string } }
}>) {
  const contextData = useVoteFormActionsContext()
  const {
    txVote,
    txDelegatesVote,
    eligibleDelegatedVoters,
    delegatorsVotedThemselves,
    governanceSymbol,
    eligibleDelegatedVotingPower,
    delegatedVotersAddresses,
    voteEvents,
    votedAs,
    setSuccessTx,
    mode,
    votedByDelegate,
    handleVote,
    handleDelegatesVote,
    votePower,
    voterState,
    delegationInfo,
    votePhase,
  } = contextData

  const [selectedDelegatedAddresses, setSelectedDelegatedAddresses] = useState<
    string[]
  >([])

  const [snapshotData, setSnapshotData] = useState<SnapshotData | null>(null)
  const hasSubmitted = useRef(false)

  const handleSelectedAddressesChange = useCallback((addresses: string[]) => {
    setSelectedDelegatedAddresses(addresses)
  }, [])
  // This is to avoid re-rendering the modal template right after the response returns and before closing the modal
  const createSnapshot = useCallback(
    () => ({
      mode,
      eligibleDelegatedVotingPower,
      votePhase,
      votedByDelegate,
      votePower,
      delegationInfo,
      delegatedVotersAddresses,
      eligibleDelegatedVoters,
      voterState,
    }),
    [
      mode,
      eligibleDelegatedVotingPower,
      votePhase,
      votedByDelegate,
      votePower,
      delegationInfo,
      delegatedVotersAddresses,
      eligibleDelegatedVoters,
      voterState,
    ],
  )

  useEffect(() => {
    if (successTx && !hasSubmitted.current) {
      setSnapshotData(createSnapshot())
      hasSubmitted.current = true
    }
  }, [successTx, createSnapshot])

  const currentSnapshot = snapshotData || contextData

  const hasVotedWithOwnVP = useMemo(
    () =>
      currentSnapshot.voterState === VoterState.Nay ||
      currentSnapshot.voterState === VoterState.Yea,
    [currentSnapshot.voterState],
  )

  const hasDelegators = useMemo(
    () => currentSnapshot.delegatedVotersAddresses.length > 0,
    [currentSnapshot.delegatedVotersAddresses],
  )

  const showDelegateCta = useMemo(
    () =>
      hasVotedWithOwnVP &&
      !hasDelegators &&
      !currentSnapshot.delegationInfo?.aragonDelegateAddress,
    [hasVotedWithOwnVP, hasDelegators, currentSnapshot.delegationInfo],
  )

  const selectedBalance = useMemo(
    () =>
      currentSnapshot.eligibleDelegatedVoters
        .filter(delegator =>
          selectedDelegatedAddresses.includes(delegator.address),
        )
        .reduce(
          (acc: BigNumber, delegator) =>
            acc.add(BigNumber.from(delegator.votingPower)),
          BigNumber.from(0),
        ),
    [selectedDelegatedAddresses, currentSnapshot.eligibleDelegatedVoters],
  )

  const handleVoteClick = useCallback(
    (power: 'own' | 'delegated') => {
      if (!currentSnapshot.mode) return
      if (power === 'own') {
        return handleVote(currentSnapshot.mode)
      }
      return handleDelegatesVote(
        currentSnapshot.mode,
        selectedDelegatedAddresses,
      )
    },
    [
      currentSnapshot.mode,
      handleVote,
      handleDelegatesVote,
      selectedDelegatedAddresses,
    ],
  )

  const handleCtaClick = useCallback(() => openWindow(urls.delegation), [])

  const canVoteWithDelegatedPower =
    currentSnapshot.eligibleDelegatedVoters.length -
      currentSnapshot.votedByDelegate.length >
    0

  const canVoteWithOwnPower =
    currentSnapshot.votePower !== undefined &&
    currentSnapshot.votePower > 0 &&
    !hasVotedWithOwnVP

  const handleEtherscan = useEtherscanOpener(successTx?.hash ?? '', 'tx')

  useEffect(() => {
    setSuccessTx(null)
  }, [setSuccessTx])

  const canVoteWithDelegatedPowerOnly = useMemo(
    () => !canVoteWithOwnPower && canVoteWithDelegatedPower,
    [canVoteWithOwnPower, canVoteWithDelegatedPower],
  )

  const voteOption = useMemo(() => {
    return currentSnapshot.mode === 'yay' ? '“Yes”' : '“No”'
  }, [currentSnapshot.mode])

  const title = useRef(
    `You voted ${voteOption}${
      votedAs === VotedAs.delegate ? ' as a delegate' : ''
    }`,
  )

  const extraVotingTitle = useMemo(() => {
    if (canVoteWithDelegatedPowerOnly) {
      return `Vote as a delegate`
    }
    return `Vote ${voteOption} with`
  }, [canVoteWithDelegatedPowerOnly, voteOption])

  return (
    <Modal
      title={title.current}
      center
      {...modalProps}
      titleIcon={<Success color="green" height={64} width={64} />}
    >
      <LinkWrap>
        <Text size="xs" color="secondary">
          Transaction can be viewed on
        </Text>
        <Link onClick={handleEtherscan}>Etherscan</Link>
      </LinkWrap>
      {(canVoteWithDelegatedPower || canVoteWithOwnPower) && (
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
                  {currentSnapshot.votePhase === VotePhase.Objection ? (
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
                    My own ({currentSnapshot.votePower} {governanceSymbol})
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
                  eligibleDelegatedVoters={
                    currentSnapshot.eligibleDelegatedVoters
                  }
                  delegatorsVotedThemselves={delegatorsVotedThemselves}
                  governanceSymbol={governanceSymbol}
                  eligibleDelegatedVotingPower={
                    currentSnapshot.eligibleDelegatedVotingPower
                  }
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
