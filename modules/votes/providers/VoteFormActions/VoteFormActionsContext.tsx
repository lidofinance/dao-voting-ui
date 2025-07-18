import React, {
  createContext,
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

export enum VotedAs {
  delegate = 'delegate',
  owner = 'owner',
}

export type VoteFormActionsContextValue = {
  voteId: string
  successTx: ResultTx | null
  setSuccessTx: React.Dispatch<React.SetStateAction<ResultTx | null>>
  formVoteSubmitData: ReturnType<typeof useFormVoteSubmit>
  setVoteId: React.Dispatch<React.SetStateAction<string>>
  votePower: number | undefined
  handleVote: (mode: VoteMode | null) => Promise<void>
  handleDelegatesVote: (
    mode: VoteMode | null,
    selectedAddresses: string[],
  ) => Promise<void>
  votedAs: VotedAs | null
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

export const VoteFormActionsProvider: React.FC = ({ children }) => {
  const [voteId, setVoteId] = useState<string>('')
  const [successTx, setSuccessTx] = useState<ResultTx | null>(null)
  const [votedAs, setVotedAs] = useState<VotedAs | null>(null)
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

  const handleFinish: FinishHandler = async ({ tx }) => {
    await mutate()
    await doRevalidate()
    setSuccessTx(tx as unknown as ResultTx)
  }

  const formVoteSubmitData = useFormVoteSubmit({
    voteId,
    onFinish: handleFinish,
  })

  const { txVote, txDelegatesVote, isSubmitting } = formVoteSubmitData

  const handleVote = useCallback(
    _mode => {
      setVotedAs(VotedAs.owner)
      setMode(_mode)
      return formVoteSubmitData.handleVote(_mode)
    },
    [formVoteSubmitData],
  )

  const handleDelegatesVote = useCallback(
    (_mode, selectedAddresses) => {
      setVotedAs(VotedAs.delegate)
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
      successTx,
      setSuccessTx,
      votePower,
      handleVote,
      handleDelegatesVote,
      votedAs,
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
      successTx,
      setSuccessTx,
      votePower,
      handleVote,
      handleDelegatesVote,
      votedAs,
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
