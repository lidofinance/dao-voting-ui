import { noop } from 'lodash'
import { formatEther } from 'ethers/lib/utils'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useCallback } from 'react'

import {
  ContractVoting,
  ContractGovernanceToken,
} from 'modules/blockChain/contracts'
import { VoterState } from 'modules/votes/types'

type Args = {
  voteId?: string
}

export function useFormVoteInfo({ voteId }: Args) {
  const { walletAddress, isWalletConnected } = useWeb3()

  const swrVoteTime = ContractVoting.useSwrRpc('voteTime', [])

  const swrVote = ContractVoting.useSwrRpc(
    Boolean(voteId) && 'getVote',
    [voteId!],
    { onError: noop },
  )

  const swrCanVote = ContractVoting.useSwrRpc(
    Boolean(voteId) && 'canVote',
    [voteId!, walletAddress!],
    { onError: noop },
  )

  const swrCanExecute = ContractVoting.useSwrRpc(
    Boolean(voteId) && 'canExecute',
    [voteId!],
    { onError: noop },
  )

  const swrVoterState = ContractVoting.useSwrRpc(
    Boolean(voteId && walletAddress) && 'getVoterState',
    [voteId!, walletAddress!],
  )

  const swrBalanceAt = ContractGovernanceToken.useSwrRpc(
    Boolean(walletAddress && swrVote.data) && 'balanceOfAt',
    [walletAddress!, swrVote.data?.snapshotBlock!],
  )

  const revalidateVote = swrVote.mutate
  const revalidateVoterState = swrVoterState.mutate
  const revalidateCanVote = swrCanVote.mutate
  const doRevalidate = useCallback(() => {
    revalidateVote()
    revalidateVoterState()
    revalidateCanVote()
  }, [revalidateCanVote, revalidateVote, revalidateVoterState])

  const votePower = swrBalanceAt.data && Number(formatEther(swrBalanceAt.data))
  const voteTime = swrVoteTime.data && swrVoteTime.data.toNumber()

  const isLoading =
    swrVoteTime.isValidating &&
    swrVote.isValidating &&
    swrCanExecute.isValidating

  const voterState =
    swrVoterState.data === undefined
      ? null
      : swrVoterState.data === 0
      ? VoterState.NotVoted
      : swrVoterState.data === 1
      ? VoterState.VotedYay
      : VoterState.VotedNay

  return {
    swrVoteTime,
    swrVote,
    swrCanVote,
    swrCanExecute,
    swrBalanceAt,
    votePower,
    voteTime,
    isLoading,
    isWalletConnected,
    voterState,
    doRevalidate,
  }
}
