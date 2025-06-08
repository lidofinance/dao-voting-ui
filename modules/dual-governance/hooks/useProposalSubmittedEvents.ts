import invariant from 'tiny-invariant'
import { ProposalSubmittedEvent as DGProposalSubmittedEvent } from 'generated/DualGovernanceAbi'
import { ProposalSubmittedEvent as EPTProposalSubmittedEvent } from 'generated/EmergencyProtectedTimelockAbi'
import { BigNumber } from 'ethers'
import { useSWR } from '../../network/hooks/useSwr'
import { useContractHelpers } from '../../blockChain/hooks/useContractHelpers'
import { useWeb3 } from '../../blockChain/hooks/useWeb3'
import { DualGovernanceAbi__factory } from 'generated'

export type MergedProposalSubmittedEvent = {
  proposalId: BigNumber
  DGEvent?: DGProposalSubmittedEvent
  EPTEvent?: EPTProposalSubmittedEvent
}

const START_BLOCK = 252997 // TODO: REMOVE HOODI start block

const getGovernanceSetAddresses = async (contract: any): Promise<string[]> => {
  invariant(contract, 'Contract must be provided')

  try {
    const filter = contract.filters.GovernanceSet()
    const events = await contract.queryFilter(filter, START_BLOCK, 'latest')

    return events
      .map((event: any) => event.args?.newGovernance as string)
      .filter((addr: string) => !!addr)
  } catch (error) {
    console.error('Error fetching GovernanceSet events:', error)
    return []
  }
}

const getGovernanceProposalSubmittedEvents = async (
  contract: any,
  address: string,
): Promise<DGProposalSubmittedEvent[]> => {
  invariant(contract, 'Contract must be provided')

  try {
    const governanceContract = DualGovernanceAbi__factory.connect(
      address,
      contract.provider,
    )

    const filter = governanceContract.filters.ProposalSubmitted()
    const events = await governanceContract.queryFilter(
      filter,
      START_BLOCK,
      'latest',
    )

    return events as unknown as DGProposalSubmittedEvent[]
  } catch (error) {
    console.error(
      `Error fetching ProposalSubmitted events for ${address}:`,
      error,
    )
    return []
  }
}

const getEPTProposalSubmittedEvents = async (
  contract: any,
): Promise<EPTProposalSubmittedEvent[]> => {
  invariant(contract, 'Contract must be provided')

  try {
    const filter = contract.filters.ProposalSubmitted()
    const events = await contract.queryFilter(filter, START_BLOCK, 'latest')

    return events as unknown as EPTProposalSubmittedEvent[]
  } catch (error) {
    console.error('Error fetching EPT ProposalSubmitted events:', error)
    return []
  }
}

export const useProposalSubmittedEvents = (enabled = true) => {
  const { chainId } = useWeb3()
  const { emergencyProtectedTimelockHelpers, dualGovernanceHelpers } =
    useContractHelpers()

  const emergencyProtectedTimelock = emergencyProtectedTimelockHelpers.useRpc()
  const dualGovernance = dualGovernanceHelpers.useRpc()

  const swrKey = enabled
    ? [
        `proposal-submitted-events-${chainId}`,
        emergencyProtectedTimelock.address,
      ]
    : null

  return useSWR<{
    mergedProposalSubmittedEvents: MergedProposalSubmittedEvent[]
  }>(
    swrKey,
    async () => {
      try {
        const governanceAddresses = await getGovernanceSetAddresses(
          emergencyProtectedTimelock,
        )

        const governanceEventsPromises = governanceAddresses.map(address =>
          getGovernanceProposalSubmittedEvents(dualGovernance, address),
        )
        const governanceEventsArrays = await Promise.all(
          governanceEventsPromises,
        )

        const governanceEventsMap = new Map<string, DGProposalSubmittedEvent>()
        for (const events of governanceEventsArrays) {
          for (const event of events) {
            const proposalId = event.args.proposalId.toString()
            if (!governanceEventsMap.has(proposalId)) {
              governanceEventsMap.set(proposalId, event)
            }
          }
        }
        const governanceEvents = Array.from(governanceEventsMap.values())

        const EPTEvents = await getEPTProposalSubmittedEvents(
          emergencyProtectedTimelock,
        )

        const mergedEventsMap = new Map<string, MergedProposalSubmittedEvent>()

        for (const event of governanceEvents) {
          const proposalId = event.args.proposalId.toString()
          mergedEventsMap.set(proposalId, {
            proposalId: event.args.proposalId,
            DGEvent: event,
          })
        }

        for (const event of EPTEvents) {
          const proposalId = event.args.id.toString()
          const existing = mergedEventsMap.get(proposalId) || {
            proposalId: event.args.id,
          }
          mergedEventsMap.set(proposalId, {
            ...existing,
            EPTEvent: event,
          })
        }

        const mergedProposalSubmittedEvents = Array.from(
          mergedEventsMap.values(),
        )

        return {
          mergedProposalSubmittedEvents,
        }
      } catch (error) {
        console.error('Error fetching and merging proposal events:', error)
        return {
          mergedProposalSubmittedEvents: [],
        }
      }
    },
    {
      revalidateOnFocus: false,
    },
  )
}
