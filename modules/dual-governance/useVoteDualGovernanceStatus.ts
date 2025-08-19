import { getEventExecuteVote } from '../votes/utils/getEventExecuteVote'
import { useContractHelpers } from '../blockChain/hooks/useContractHelpers'
import { useSWR } from '../network/hooks/useSwr'
import { useWeb3 } from '../blockChain/hooks/useWeb3'
import { utils } from 'ethers'
import { useGetContractAddress } from '../blockChain/hooks/useGetContractAddress'

type Args = {
  voteId: number | string
  snapshotBlock: number
}

export const useVoteDualGovernanceStatus = ({
  voteId,
  snapshotBlock,
}: Args) => {
  const { votingHelpers, emergencyProtectedTimelockHelpers } =
    useContractHelpers()
  const voting = votingHelpers.useRpc()
  const { library } = useWeb3()
  const getContractAddress = useGetContractAddress()
  const dualGovernanceAddress = getContractAddress('DualGovernance')

  const emergencyProtectedTimelock = emergencyProtectedTimelockHelpers.useRpc()

  return useSWR(`${voteId}-dg-status`, async () => {
    const executeEvent = await getEventExecuteVote(
      voting,
      voteId,
      snapshotBlock,
    )
    if (executeEvent) {
      const receipt = await library?.getTransactionReceipt(
        executeEvent.event.transactionHash,
      )

      if (!receipt) {
        return null
      }

      const proposalSubmittedEventAbi = [
        'event ProposalSubmitted(address indexed proposerAccount, uint256 indexed proposalId, string metadata)',
      ]

      const proposalSubmittedEventAbiInterface = new utils.Interface(
        proposalSubmittedEventAbi,
      )
      const proposalSubmittedTopic =
        proposalSubmittedEventAbiInterface.getEventTopic('ProposalSubmitted')

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
