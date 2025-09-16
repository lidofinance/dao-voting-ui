import { utils } from 'ethers'

export const proposalSubmittedEventAbi = [
  'event ProposalSubmitted(address indexed proposerAccount, uint256 indexed proposalId, string metadata)',
]

export const proposalSubmittedEventAbiInterface = new utils.Interface(
  proposalSubmittedEventAbi,
)

export const proposalSubmittedTopic =
  proposalSubmittedEventAbiInterface.getEventTopic('ProposalSubmitted')
