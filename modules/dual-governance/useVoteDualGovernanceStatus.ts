import { useContractHelpers } from '../blockChain/hooks/useContractHelpers'
import { useSWR } from '../network/hooks/useSwr'
import { useWeb3 } from '../blockChain/hooks/useWeb3'
import { useGetContractAddress } from '../blockChain/hooks/useGetContractAddress'
import { EventExecuteVote } from '../votes/types'
import {
  proposalSubmittedEventAbiInterface,
  proposalSubmittedTopic,
} from './constants'

type Args = {
  voteId: number | string
  eventExecuteVote: EventExecuteVote | undefined
}

export const useVoteDualGovernanceStatus = ({
  voteId,
  eventExecuteVote,
}: Args) => {
  const { emergencyProtectedTimelockHelpers } = useContractHelpers()
  const { rpcProvider } = useWeb3()
  const getContractAddress = useGetContractAddress()
  const dualGovernanceAddress = getContractAddress('DualGovernance')

  const emergencyProtectedTimelock = emergencyProtectedTimelockHelpers.useRpc()

  return useSWR(`${voteId}-dg-status`, async () => {
    if (eventExecuteVote) {
      const receipt = await rpcProvider?.getTransactionReceipt(
        eventExecuteVote.event.transactionHash,
      )

      if (!receipt) {
        return null
      }

      const proposalSubmittedLog = receipt.logs.find(
        log =>
          log.address.toLowerCase() === dualGovernanceAddress.toLowerCase() &&
          log.topics[0] === proposalSubmittedTopic,
      )

      if (!proposalSubmittedLog) {
        return null
      }

      const parsedProposalSubmittedLog =
        proposalSubmittedEventAbiInterface.parseLog(proposalSubmittedLog)

      const proposalId = parsedProposalSubmittedLog.args.proposalId
      const proposalInfo = await emergencyProtectedTimelock.getProposal(
        proposalId,
      )
      const proposalStatus = proposalInfo.proposalDetails.status

      return {
        proposalId: proposalId.toNumber(),
        proposalStatus,
      }
    }
    return null
  })
}
