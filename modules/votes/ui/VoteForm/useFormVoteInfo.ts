import { noop } from 'lodash'
import { formatEther } from 'ethers/lib/utils'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import {
  ContractVoting,
  ContractGovernanceToken,
} from 'modules/blockChain/contracts'

type Args = {
  voteId?: string
  isVoteTxSuccess: boolean
}

export function useFormVoteInfo({ voteId, isVoteTxSuccess }: Args) {
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

  const swrBalanceAt = ContractGovernanceToken.useSwrWeb3(
    Boolean(walletAddress && swrVote.data) && 'balanceOfAt',
    [walletAddress!, swrVote.data?.snapshotBlock!],
  )

  const balanceAtFormatted = swrBalanceAt.data && formatEther(swrBalanceAt.data)
  const voteTime = swrVoteTime.data && swrVoteTime.data.toNumber()

  const isLoading =
    swrVoteTime.isValidating &&
    swrVote.isValidating &&
    swrCanExecute.isValidating

  const showActions =
    isWalletConnected && swrCanVote.data === true && !isVoteTxSuccess

  const showCannotVote =
    isWalletConnected && swrCanVote.data === false && !isVoteTxSuccess

  return {
    swrVoteTime,
    swrVote,
    swrCanVote,
    swrCanExecute,
    swrBalanceAt,
    balanceAtFormatted,
    voteTime,
    isLoading,
    isWalletConnected,
    showActions,
    showCannotVote,
  }
}
