import { noop } from 'lodash'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import { ContractVoting } from 'modules/blockChain/contracts'

type Args = {
  voteId?: string
}

export function useFormVoteInfo({ voteId }: Args) {
  const { walletAddress } = useWeb3()

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

  return {
    swrVote,
    swrCanVote,
    swrCanExecute,
  }
}
