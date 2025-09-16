import { ethers } from 'ethers'
import {
  proposalSubmittedEventAbiInterface,
  proposalSubmittedTopic,
} from './constants'
import { EmergencyProtectedTimelockAbi } from 'generated'

export const getVoteDualGovernanceStatus = async (
  executeTxHash: string | null | undefined,
  dualGovernanceAddress: string,
  rpcProvider:
    | ethers.providers.JsonRpcProvider
    | ethers.providers.FallbackProvider,
  emergencyProtectedTimelock: EmergencyProtectedTimelockAbi,
) => {
  if (!executeTxHash) {
    return null
  }

  const receipt = await rpcProvider.getTransactionReceipt(executeTxHash)

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
  const proposalInfo = await emergencyProtectedTimelock.getProposal(proposalId)
  const proposalStatus = proposalInfo.proposalDetails.status

  return {
    proposalId: proposalId.toNumber() as number,
    proposalStatus,
  }
}
