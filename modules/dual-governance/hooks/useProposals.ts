import { useWeb3 } from '../../blockChain/hooks/useWeb3'
import { useSWR } from '../../network/hooks/useSwr'
import { useContractHelpers } from '../../blockChain/hooks/useContractHelpers'
import { BigNumber } from 'ethers'
import invariant from 'tiny-invariant'
import { useProposalSubmittedEvents } from './useProposalSubmittedEvents'
import { ProposalCombinedData, ProposalDetails } from '../types'

export interface ProposalsQueryResult {
  proposalsCount: BigNumber | bigint
  proposals: ProposalCombinedData[]
}

export const useProposals = (enabled = true) => {
  const { chainId } = useWeb3()
  const { emergencyProtectedTimelockHelpers } = useContractHelpers()
  const emergencyProtectedTimelock = emergencyProtectedTimelockHelpers.useRpc()

  const { data: proposalEvents } = useProposalSubmittedEvents(enabled)

  const { data: proposalsCount } = useSWR<BigNumber>(
    enabled ? `proposals-count-${chainId}` : null,
    async () => {
      try {
        return await emergencyProtectedTimelock.getProposalsCount()
      } catch (error) {
        console.error('Unable to fetch proposals count', error)
        return BigNumber.from(0)
      }
    },
  )

  return useSWR<ProposalsQueryResult>(
    enabled && proposalsCount && proposalEvents
      ? [
          'getProposals',
          emergencyProtectedTimelock.address,
          proposalsCount.toString(),
          chainId,
        ]
      : null,
    async () => {
      invariant(proposalsCount !== undefined, 'Proposals count is required')
      invariant(proposalEvents !== undefined, 'Proposal events are required')

      try {
        const { mergedProposalSubmittedEvents } = proposalEvents

        const mapProposalsData = mergedProposalSubmittedEvents.map(
          async mergedProposalSubmittedEvent => {
            try {
              const proposalInfo = await emergencyProtectedTimelock.getProposal(
                mergedProposalSubmittedEvent.proposalId,
              )

              const details: ProposalDetails = {
                id: proposalInfo.proposalDetails.id,
                executor: proposalInfo.proposalDetails.executor || '',
                submittedAt: proposalInfo.proposalDetails.submittedAt || 0,
                scheduledAt: proposalInfo.proposalDetails.scheduledAt || 0,
                status: proposalInfo.proposalDetails.status || 0,
              }

              const result: ProposalCombinedData = {
                ...mergedProposalSubmittedEvent,
                proposalDetails: details,
              }

              return result
            } catch (e) {
              console.error(
                `Failed to process proposal data for log with ID ${mergedProposalSubmittedEvent.proposalId}:`,
                e,
              )
              return {
                ...mergedProposalSubmittedEvent,
                proposalDetails: {
                  id: mergedProposalSubmittedEvent.proposalId,
                  executor: '',
                  submittedAt: 0,
                  scheduledAt: 0,
                  status: 0,
                },
              }
            }
          },
        )

        const proposals = await Promise.all(mapProposalsData)

        return { proposalsCount, proposals }
      } catch (error) {
        console.error('Failed to fetch proposals:', error)
        return { proposalsCount: BigNumber.from(0), proposals: [] }
      }
    },
    {
      revalidateOnFocus: false,
    },
  )
}
