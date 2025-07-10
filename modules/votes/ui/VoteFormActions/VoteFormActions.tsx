import { Button, PopupMenu, PopupMenuItem, Text } from '@lidofinance/lido-ui'
import { Actions, TxStatusWrapper } from './VoteFormActionsStyle'
import CheckSVG from 'assets/check.com.svg.react'
import CrossSVG from 'assets/cross.com.svg.react'

import { VoteMode, VotePhase, VoterState } from '../../types'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { VoteButton } from './VoteButton'
import { useVoteFormActionsContext } from 'modules/votes/providers/VoteFormActions/VoteFormActionsContext'
import { useEligibleDelegators } from 'modules/delegation/hooks/useEligibleDelegators'
import { formatBalance } from 'modules/blockChain/utils/formatBalance'
import { BigNumber } from '@ethersproject/bignumber'
import { getUseModal } from 'modules/modal/useModal'
import { VoteSubmitModal } from 'modules/votes/ui/VoteActionsModals/SubmitModal/VoteSubmitModal'
import { VoteSuccessModal } from 'modules/votes/ui/VoteActionsModals/SuccessModal/VoteSuccessModal'
import { ResultTx } from 'modules/blockChain/types'
import { TxRow } from 'modules/blockChain/ui/TxRow'
import { DelegatorsList } from 'modules/votes/ui/VoteActionsModals/DelegatorsList/VoteActionsDelegatorsList'
import { VoteActionButtonObjectionTooltip } from 'modules/votes/ui/VoteActionButtonObjectionTooltip'
import { useGovernanceTokenData } from 'modules/tokens/hooks/useGovernanceTokenData'

type Props = {
  canEnact: boolean
  voterState: VoterState
  votePhase: VotePhase | undefined
  isSubmitting: false | VoteMode
  onEnact: () => void
  voteId: string
  votePowerWei: BigNumber | null | undefined
  votePower: number | undefined
}

type ModalData = {
  mode?: VoteMode
  successTx?: ResultTx
  voterState?: VoterState
}

type ModalKey = 'submit' | 'success'

export function VoteFormActions({
  canEnact,
  voterState,
  votePhase,
  isSubmitting,
  onEnact,
  voteId,
  votePowerWei,
  votePower,
}: Props) {
  const {
    data: { eligibleDelegatedVoters, eligibleDelegatedVotingPower },
  } = useEligibleDelegators({ voteId })

  const {
    handleVote,
    handleDelegatesVote,
    txVote,
    txDelegatesVote,
    setVoteId: setVoteFormActionsModalsVoteId,
    isSubmitting: isVoteSubmitting,
    successTx,
    voteEvents,
    delegatorsVotedThemselves,
  } = useVoteFormActionsContext()

  const useSubmitModal = getUseModal(VoteSubmitModal)
  const useSuccessModal = getUseModal(VoteSuccessModal)

  const { openModal: openSubmitModal, closeModal: closeSubmitModal } =
    useSubmitModal()

  const { openModal: openSuccessModal, closeModal: SuccessModal } =
    useSuccessModal()

  const { data: tokenData } = useGovernanceTokenData()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeVoteType, setActiveVoteType] = useState<VoteMode | null>(null)
  const [selectedDelegatedAddresses, setSelectedDelegatedAddresses] = useState<
    string[]
  >([])

  const modalsActions = useMemo(
    () => ({
      submit: {
        openModal: openSubmitModal,
        closeModal: closeSubmitModal,
      },
      success: {
        openModal: openSuccessModal,
        closeModal: SuccessModal,
      },
    }),
    [openSubmitModal, closeSubmitModal, openSuccessModal, SuccessModal],
  )

  const isValidPhaseToVote = useMemo(
    () => votePhase === VotePhase.Main || votePhase === VotePhase.Objection,
    [votePhase],
  )

  const nayButtonRef = useRef(null)
  const yayButtonRef = useRef(null)

  const canVoteWithOwnPower = votePower !== undefined && votePower > 0
  const canVoteWithDelegatedPower = eligibleDelegatedVoters.length > 0

  const canVote = useMemo(
    () =>
      isValidPhaseToVote &&
      (eligibleDelegatedVoters.length > 0 ||
        (votePower !== undefined && votePower > 0)),
    [isValidPhaseToVote, votePower, eligibleDelegatedVoters],
  )

  const preparedOwnVP = useMemo(
    () => `${formatBalance(votePowerWei || 0)} ${tokenData?.symbol}`,
    [tokenData?.symbol, votePowerWei],
  )

  const preparedDelegatedVP = useMemo(
    () => `${formatBalance(eligibleDelegatedVotingPower)} ${tokenData?.symbol}`,
    [tokenData?.symbol, eligibleDelegatedVotingPower],
  )

  const switchModal = useCallback(
    (fromKey: ModalKey, toKey: ModalKey, data?: ModalData) => {
      modalsActions[fromKey].closeModal()
      setTimeout(() => modalsActions[toKey].openModal(data), 100)
    },
    [modalsActions],
  )

  const handleSubmit = useCallback(
    (data?: ModalData) => {
      switchModal('submit', 'success', data)
    },
    [switchModal],
  )

  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  const handleVoteClick = useCallback(
    async (voteType?) => {
      const currentVoteType = voteType || activeVoteType
      await handleVote(currentVoteType)
      setIsMenuOpen(false)
    },
    [handleVote, activeVoteType],
  )

  const handleOpenModal = useCallback(() => {
    handleMenuClose()
    modalsActions.submit.openModal({ mode: activeVoteType })
  }, [activeVoteType, handleMenuClose, modalsActions.submit])

  const handleMenuOpen = useCallback(
    async (voteType: VoteMode) => {
      if (canVoteWithOwnPower && canVoteWithDelegatedPower) {
        setActiveVoteType(voteType)
        setIsMenuOpen(true)
      } else if (canVoteWithOwnPower) {
        setActiveVoteType(voteType)
        await handleVoteClick(voteType)
      } else if (canVoteWithDelegatedPower) {
        setActiveVoteType(voteType)
        await handleDelegatesVote(voteType, selectedDelegatedAddresses)
      }
    },
    [
      canVoteWithOwnPower,
      canVoteWithDelegatedPower,
      handleVoteClick,
      handleDelegatesVote,
      selectedDelegatedAddresses,
    ],
  )

  const handleSelectedAddressesChange = useCallback(addresses => {
    setSelectedDelegatedAddresses(addresses)
  }, [])

  const canVoteWithDelegatedPowerOnly = useMemo(
    () => !canVoteWithOwnPower && canVoteWithDelegatedPower,
    [canVoteWithOwnPower, canVoteWithDelegatedPower],
  )

  useEffect(() => {
    setVoteFormActionsModalsVoteId(voteId)
  }, [voteId, setVoteFormActionsModalsVoteId])

  useEffect(() => {
    if (successTx !== null && !('safeTxHash' in successTx)) {
      handleSubmit({ successTx, voterState })
    }
  }, [successTx, handleSubmit, voterState])

  const nayButtonLabel = 'No'

  const yayButtonLabel = 'Yes'

  const getDisableCondition = useCallback(
    (currentMode: VoteMode | null): boolean => {
      const isObjectionPhase = votePhase === VotePhase.Objection
      const isYay = currentMode === 'yay'

      if (isYay && isObjectionPhase) {
        return true
      }

      return Boolean(isVoteSubmitting) && isVoteSubmitting !== currentMode
    },
    [votePhase, isVoteSubmitting],
  )

  const renderVoteButton = useCallback(
    (voteType: VoteMode, label: string, icon: React.ReactNode) => (
      <VoteButton
        ref={voteType === 'nay' ? nayButtonRef : yayButtonRef}
        voteType={voteType}
        isSubmitting={isVoteSubmitting}
        label={label}
        icon={icon}
        disabledCondition={getDisableCondition(voteType)}
        openModal={() => handleMenuOpen(voteType)}
      />
    ),
    [isVoteSubmitting, getDisableCondition, handleMenuOpen],
  )

  if (!canVote && !canEnact) return null

  /**
   * Show the buttons only if we have any voting power (Own, delegated) & isValidPhaseToVote
   * During the objection phase, disable the Yay button
   */

  return (
    <>
      {canVoteWithDelegatedPowerOnly && votePhase !== VotePhase.Closed && (
        <DelegatorsList
          eligibleDelegatedVoters={eligibleDelegatedVoters}
          delegatorsVotedThemselves={delegatorsVotedThemselves}
          governanceSymbol={tokenData?.symbol}
          eligibleDelegatedVotingPower={eligibleDelegatedVotingPower}
          onSelectedAddressesChange={handleSelectedAddressesChange}
          voteEvents={voteEvents}
          defaultExpanded={false}
        />
      )}
      <Actions>
        {canVote && (
          <>
            {renderVoteButton('nay', nayButtonLabel, <CrossSVG />)}
            {votePhase === VotePhase.Objection ? (
              <VoteActionButtonObjectionTooltip>
                {renderVoteButton('yay', yayButtonLabel, <CheckSVG />)}
              </VoteActionButtonObjectionTooltip>
            ) : (
              renderVoteButton('yay', yayButtonLabel, <CheckSVG />)
            )}
          </>
        )}
        <PopupMenu
          anchorRef={activeVoteType === 'nay' ? nayButtonRef : yayButtonRef}
          onClose={handleMenuClose}
          style={{
            width: 200,
          }}
          themeOverride="light"
          variant="default"
          open={isMenuOpen}
        >
          {canVoteWithOwnPower && (
            <PopupMenuItem
              data-testid="myOwnVPBtn"
              onClick={() => handleVoteClick()}
            >
              {`My own (${preparedOwnVP})`}
            </PopupMenuItem>
          )}
          {eligibleDelegatedVotingPower.gt(0) && (
            <PopupMenuItem
              data-testid="delegatedVPBtn"
              onClick={handleOpenModal}
            >
              {`Delegated (${preparedDelegatedVP})`}
            </PopupMenuItem>
          )}
        </PopupMenu>
        {canEnact && (
          <Button
            color="success"
            children="Enact"
            loading={isSubmitting === 'enact'}
            disabled={getDisableCondition('enact')}
            onClick={() => onEnact()}
          />
        )}
      </Actions>
      {!txVote.isEmpty && (
        <TxStatusWrapper data-testid="txStatusOwn">
          <Text size="xxs" color="secondary">
            Vote tx status (with own {tokenData?.symbol})
          </Text>
          <TxRow tx={txVote} onClick={txVote.open} />
        </TxStatusWrapper>
      )}
      {!txDelegatesVote.isEmpty && (
        <TxStatusWrapper data-testid="txStatusDelegated">
          <Text size="xxs" color="secondary">
            Vote tx status (with delegated VP)
          </Text>
          <TxRow tx={txDelegatesVote} onClick={txDelegatesVote.open} />
        </TxStatusWrapper>
      )}
    </>
  )
}
