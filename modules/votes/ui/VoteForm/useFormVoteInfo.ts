import { noop } from 'lodash'
import { formatEther } from 'ethers/lib/utils'
import { useCallback } from 'react'
import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import {
  ContractVoting,
  ContractGovernanceToken,
} from 'modules/blockChain/contracts'
import { VoterState } from 'modules/votes/types'

type Args = {
  voteId?: string
}

export function useFormVoteInfo({ voteId }: Args) {
  const { chainId, walletAddress, isWalletConnected } = useWeb3()

  const swrVote = useSWR(
    voteId ? [`vote-info`, voteId, chainId, walletAddress] : null,
    async (
      _,
      _voteId: typeof voteId,
      _chainId: typeof chainId,
      _walletAddress: typeof walletAddress,
    ) => {
      if (!_voteId || !_walletAddress) return null

      const connectArg = { chainId: _chainId }
      const contractVoting = ContractVoting.connectRpc(connectArg)
      const contractToken = ContractGovernanceToken.connectRpc(connectArg)

      const [
        voteTime,
        objectionPhaseTime,
        vote,
        canVote,
        canExecute,
        voterState,
      ] = await Promise.all([
        contractVoting.voteTime(),
        contractVoting.objectionPhaseTime(),
        contractVoting.getVote(_voteId),
        contractVoting.canVote(_voteId, _walletAddress),
        contractVoting.canExecute(_voteId),
        contractVoting.getVoterState(_voteId, _walletAddress),
      ])

      const balanceAt = await contractToken.balanceOfAt(
        _walletAddress,
        vote.snapshotBlock,
      )

      const votePower = Number(formatEther(balanceAt))

      return {
        voteTime,
        objectionPhaseTime,
        vote,
        canVote,
        canExecute,
        voterState,
        votePower,
      }
    },
    { onError: noop },
  )

  const vote = swrVote.data?.vote
  const startDate = vote?.startDate.toNumber()
  const voteTime = swrVote.data?.voteTime.toNumber()
  const objectionPhaseTime = swrVote.data?.objectionPhaseTime.toNumber()
  const votePower = swrVote.data?.votePower
  const canVote = Boolean(swrVote.data?.canVote)
  const canExecute = swrVote.data?.canExecute
  const isLoading = swrVote.initialLoading

  const voterState =
    swrVote.data?.voterState === undefined
      ? null
      : swrVote.data.voterState === 0
      ? VoterState.NotVoted
      : swrVote.data.voterState === 1
      ? VoterState.VotedYay
      : VoterState.VotedNay

  const mutateFn = swrVote.mutate
  const doRevalidate = useCallback(() => {
    // Immediate revalidation glitches sometimes
    // That's why there is timeout
    setTimeout(() => mutateFn(), 1200)
  }, [mutateFn])

  return {
    swrVote,
    vote,
    voteTime,
    votePower,
    voterState,
    startDate,
    objectionPhaseTime,
    canVote,
    canExecute,
    isLoading,
    isWalletConnected,
    doRevalidate,
  }
}
