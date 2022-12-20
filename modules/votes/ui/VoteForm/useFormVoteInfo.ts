import { noop } from 'lodash'
import { formatEther } from 'ethers/lib/utils'
import { useCallback, useEffect } from 'react'
import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useConfig } from 'modules/config/hooks/useConfig'

import {
  ContractVoting,
  ContractGovernanceToken,
} from 'modules/blockChain/contracts'
import { VoterState } from 'modules/votes/types'
import { getEventExecuteVote } from 'modules/votes/utils/getEventExecuteVote'
import { getVoteStatus } from 'modules/votes/utils/getVoteStatus'
import { getEventStartVote } from 'modules/votes/utils/getEventVoteStart'
import { getEventsCastVote } from 'modules/votes/utils/getEventsCastVote'

type Args = {
  voteId?: string
}

export function useFormVoteInfo({ voteId }: Args) {
  const { getRpcUrl } = useConfig()
  const { chainId, walletAddress, isWalletConnected } = useWeb3()
  const rpcUrl = getRpcUrl(chainId)
  const contractVoting = ContractVoting.useRpc()

  const swrVote = useSWR(
    voteId ? [`vote-info`, voteId, chainId, walletAddress, rpcUrl] : null,
    async (
      _,
      _voteId: typeof voteId,
      _chainId: typeof chainId,
      _walletAddress: typeof walletAddress,
      _rpcUrl: typeof rpcUrl,
    ) => {
      if (!_voteId) return null

      const connectArg = { chainId: _chainId, rpcUrl: _rpcUrl }
      const contractToken = ContractGovernanceToken.connectRpc(connectArg)

      const [voteTime, objectionPhaseTime, vote, canExecute] =
        await Promise.all([
          contractVoting.voteTime(),
          contractVoting.objectionPhaseTime(),
          contractVoting.getVote(_voteId),
          contractVoting.canExecute(_voteId),
        ])

      const snapshotBlock = vote.snapshotBlock.toNumber()
      const [
        eventStart,
        eventsVoted,
        eventExecuteVote,
        canVote,
        voterState,
        votePowerWei,
      ] = await Promise.all([
        getEventStartVote(contractVoting, _voteId, snapshotBlock),
        getEventsCastVote(contractVoting, _voteId, snapshotBlock),
        getEventExecuteVote(contractVoting, _voteId, snapshotBlock),
        _walletAddress
          ? contractVoting.canVote(_voteId, _walletAddress)
          : false,
        _walletAddress
          ? contractVoting.getVoterState(_voteId, _walletAddress)
          : null,
        _walletAddress
          ? contractToken.balanceOfAt(_walletAddress, vote.snapshotBlock)
          : null,
      ])

      const votePower = votePowerWei ? Number(formatEther(votePowerWei)) : 0

      return {
        voteTime,
        objectionPhaseTime,
        vote,
        canVote,
        canExecute,
        voterState,
        votePower,
        eventStart,
        eventsVoted,
        eventExecuteVote,
        status: getVoteStatus(vote, canExecute),
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
    // TODO:
    // Immediate revalidation glitches sometimes:
    // It appears accidentally when we fetch data that was changed immediately after the change. It returns it's old version from chain.
    // Small timeout is a fix for this glitch.
    // That's why there is timeout
    setTimeout(() => mutateFn(), 1200)
  }, [mutateFn])

  useEffect(() => {
    const eventFilter = contractVoting.filters.CastVote(Number(voteId))
    contractVoting.on(eventFilter, doRevalidate)
    return () => {
      contractVoting.off(eventFilter, doRevalidate)
    }
  }, [doRevalidate, contractVoting, voteId])

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
    eventStart: swrVote.data?.eventStart,
    eventsVoted: swrVote.data?.eventsVoted,
    eventExecuteVote: swrVote.data?.eventExecuteVote,
    status: swrVote.data?.status,
  }
}
