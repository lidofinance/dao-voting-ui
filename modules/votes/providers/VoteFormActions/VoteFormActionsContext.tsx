import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  EligibleDelegatorsData,
  useEligibleDelegators,
} from 'modules/delegation/hooks/useEligibleDelegators'
import { useFormVoteSubmit } from 'modules/votes/ui/VoteForm/useFormVoteSubmit'
import { useFormVoteInfo } from 'modules/votes/ui/VoteForm/useFormVoteInfo'

import { ResultTx } from 'modules/blockChain/types'
import { VoteEvent, VoteMode, VotePhase } from 'modules/votes/types'

import invariant from 'tiny-invariant'

import { BigNumber } from '@ethersproject/bignumber'
import {
  FinishHandler,
  TransactionSender,
} from 'modules/blockChain/hooks/useTransactionSender'
import { useDelegationInfo } from 'modules/delegation/hooks/useDelegationInfo'
import { DelegationInfo } from 'modules/delegation/types'
import { useGovernanceTokenData } from 'modules/tokens/hooks/useGovernanceTokenData'

export type VotedAs = 'owner' | 'delegate'

export type SuccessData = {
  successTx: ResultTx
  votedAsLog: VotedAs[]
}

export type VoteFormActionsContextValue = {
  voteId: string
  successData: SuccessData | null
  setSuccessData: React.Dispatch<React.SetStateAction<SuccessData | null>>
  formVoteSubmitData: ReturnType<typeof useFormVoteSubmit>
  setVoteId: React.Dispatch<React.SetStateAction<string>>
  votePower: number | undefined
  handleVote: (mode: VoteMode | null | undefined) => Promise<void>
  handleDelegatesVote: (
    mode: VoteMode | null | undefined,
    selectedAddresses: string[],
  ) => Promise<void>
  mode: VoteMode | null
  txVote: TransactionSender
  txDelegatesVote: TransactionSender
  voteEvents: VoteEvent[] | undefined
  eligibleDelegatedVotingPower: BigNumber
  delegatedVotersAddresses: string[]
  eligibleDelegatedVoters: EligibleDelegatorsData['eligibleDelegatedVoters']
  eligibleDelegatedVotersAddresses: string[]
  delegatorsVotedThemselves: VoteEvent[] | undefined
  governanceSymbol: string | undefined
  votedByDelegate: EligibleDelegatorsData['eligibleDelegatedVoters']
  voterState: number | null | undefined
  isSubmitting: false | VoteMode
  delegationInfo: DelegationInfo | undefined
  votePhase: VotePhase | undefined
}

const VoteFormActionsContext =
  createContext<VoteFormActionsContextValue | null>(null)

export const useVoteFormActionsContext = () => {
  const value = useContext(VoteFormActionsContext)
  invariant(
    value,
    'useVoteFormActionsContext was used outside the VoteFormActionsContext provider',
  )
  return value
}

export const VoteFormActionsProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [voteId, setVoteId] = useState<string>('')
  const [successData, setSuccessData] = useState<SuccessData | null>(null)
  const [votedAsDraft, setVotedAsDraft] = useState<VotedAs | null>(null)
  const [mode, setMode] = useState<VoteMode | null>(null)

  const { data: eligibleDelegatorsData, mutate } = useEligibleDelegators({
    voteId,
  }) as { data: EligibleDelegatorsData; mutate: () => Promise<void> }

  const formVoteInfoData = useFormVoteInfo({ voteId })

  const { data: delegationInfo } = useDelegationInfo()

  const { data: tokenData } = useGovernanceTokenData()

  const {
    voteEvents,
    voterState,
    votePhase,
    votePower,
    mutate: doRevalidate,
  } = formVoteInfoData

  const handleFinish: FinishHandler = async successTx => {
    await mutate()
    await doRevalidate()
    const votedAsLog = votedAsDraft
      ? [...(successData?.votedAsLog ?? []), votedAsDraft]
      : []
    setSuccessData({ successTx, votedAsLog })
  }

  const formVoteSubmitData = useFormVoteSubmit({
    voteId,
    onError: () => {
      setSuccessData(null)
      setVotedAsDraft(null)
    },
    onFinish: handleFinish,
  })

  const { txVote, txDelegatesVote, isSubmitting } = formVoteSubmitData

  const handleVote = useCallback(
    (_mode: VoteMode) => {
      setVotedAsDraft('owner')
      setMode(_mode)
      return formVoteSubmitData.handleVote(_mode)
    },
    [formVoteSubmitData],
  )

  const handleDelegatesVote = useCallback(
    (_mode: VoteMode, selectedAddresses: string[]) => {
      setVotedAsDraft('delegate')
      setMode(_mode)
      return formVoteSubmitData.handleDelegatesVote(_mode, selectedAddresses)
    },
    [formVoteSubmitData],
  )

  const delegatedVotersAddresses = useMemo(
    () => eligibleDelegatorsData.delegatedVotersAddresses,
    [eligibleDelegatorsData],
  )

  const delegatorsVotedThemselves = useMemo(() => {
    const delegatorSet = new Set(delegatedVotersAddresses)

    const votedThroughDelegateSet = new Set(
      voteEvents.flatMap(
        event => event.delegatedVotes?.map(e => e.voter) ?? [],
      ),
    )

    return voteEvents.filter(
      event =>
        !event.delegatedVotes?.length &&
        delegatorSet.has(event.voter) &&
        !votedThroughDelegateSet.has(event.voter),
    )
  }, [delegatedVotersAddresses, voteEvents])

  const eligibleDelegatedVoters = useMemo(
    () => eligibleDelegatorsData.eligibleDelegatedVoters,
    [eligibleDelegatorsData],
  )

  const votedByDelegate = useMemo(
    () =>
      eligibleDelegatedVoters.filter(delegator => delegator.votedByDelegate),
    [eligibleDelegatedVoters],
  )

  const contextValue = useMemo(
    () => ({
      voteId,
      setVoteId,
      formVoteSubmitData,
      formVoteInfoData,
      votePower,
      handleVote,
      handleDelegatesVote,
      successData,
      setSuccessData,
      mode,
      txVote,
      txDelegatesVote,
      voteEvents,
      eligibleDelegatedVotingPower:
        eligibleDelegatorsData.eligibleDelegatedVotingPower,
      delegatedVotersAddresses,
      eligibleDelegatedVoters,
      eligibleDelegatedVotersAddresses:
        eligibleDelegatorsData.eligibleDelegatedVotersAddresses,
      delegatorsVotedThemselves,
      governanceSymbol: tokenData?.symbol,
      votedByDelegate,
      voterState,
      isSubmitting,
      delegationInfo,
      votePhase,
    }),
    [
      voteId,
      eligibleDelegatorsData,
      formVoteSubmitData,
      formVoteInfoData,
      successData,
      setSuccessData,
      votePower,
      handleVote,
      handleDelegatesVote,
      mode,
      txVote,
      txDelegatesVote,
      delegatedVotersAddresses,
      delegatorsVotedThemselves,
      eligibleDelegatedVoters,
      votedByDelegate,
      voterState,
      isSubmitting,
      delegationInfo,
      votePhase,
      tokenData?.symbol,
      voteEvents,
    ],
  )

  return (
    <VoteFormActionsContext.Provider value={contextValue}>
      {children}
    </VoteFormActionsContext.Provider>
  )
}
