import { noop } from 'lodash'
import { formatEther } from 'ethers/lib/utils'
import { useCallback } from 'react'
import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useConfig } from 'modules/config/hooks/useConfig'

import {
  ContractVoting,
  ContractGovernanceToken,
} from 'modules/blockChain/contracts'
import { VoterState } from 'modules/votes/types'
import { getEventStartVote } from 'modules/votes/utils/getEventVoteStart'
import { getEventsVoted } from 'modules/votes/utils/getEventsVoted'

type Args = {
  voteId?: string
}

export function useFormVoteInfo({ voteId }: Args) {
  const { getRpcUrl } = useConfig()
  const { chainId, walletAddress, isWalletConnected } = useWeb3()
  const rpcUrl = getRpcUrl(chainId)

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
      const contractVoting = ContractVoting.connectRpc(connectArg)
      const contractToken = ContractGovernanceToken.connectRpc(connectArg)

      const [voteTime, objectionPhaseTime, vote, canExecute] =
        await Promise.all([
          contractVoting.voteTime(),
          contractVoting.objectionPhaseTime(),
          contractVoting.getVote(_voteId),
          contractVoting.canExecute(_voteId),
        ])

      const snapshotBlock = vote.snapshotBlock.toNumber()

      const [eventStart, eventsVoted, [canVote, voterState, votePower]] =
        await Promise.all([
          getEventStartVote(contractVoting, _voteId, snapshotBlock),
          getEventsVoted(contractVoting, _voteId, snapshotBlock),
          (async () => {
            if (!_walletAddress) {
              return [false, null, 0] as const
            }

            const [_canVote, _voterState, balanceAt] = await Promise.all([
              contractVoting.canVote(_voteId, _walletAddress),
              contractVoting.getVoterState(_voteId, _walletAddress),
              contractToken.balanceOfAt(_walletAddress, vote.snapshotBlock),
            ])
            const _votePower = Number(formatEther(balanceAt))

            return [_canVote, _voterState, _votePower] as const
          })(),
        ])

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
    eventStart: swrVote.data?.eventStart,
    eventsVoted: swrVote.data?.eventsVoted,
  }
}
