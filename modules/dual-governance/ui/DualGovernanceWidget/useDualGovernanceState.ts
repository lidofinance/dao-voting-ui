import { useLidoSWR } from '@lido-sdk/react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { CHAINS } from '@lido-sdk/constants'
import {
  ContractDualGovernance,
  ContractEmergencyProtectedTimelock,
  ContractStEth,
} from 'modules/blockChain/contracts'
import {
  DGEscrowAbi__factory,
  DualGovernanceAbi,
  EmergencyProtectedTimelockAbi,
} from 'generated'
import { useConfig } from 'modules/config/hooks/useConfig'
import { getStaticRpcBatchProvider } from '@lido-sdk/providers'

const getActiveProposalsCount = async (
  dualGovernanceContract: DualGovernanceAbi,
  timelockContract: EmergencyProtectedTimelockAbi,
) => {
  const filter = dualGovernanceContract.filters.ProposalSubmitted()
  const events = await dualGovernanceContract.queryFilter(filter)

  let count = 0

  for (const event of events) {
    const proposal = await timelockContract.getProposal(event.args.proposalId)
    if (
      proposal.proposalDetails.status === 1 || // Submitted
      proposal.proposalDetails.status === 2 // Scheduled
    ) {
      count++
    }
  }

  return count
}

export const useDualGovernanceState = () => {
  const { chainId } = useWeb3()
  const dualGovernance = ContractDualGovernance.useRpc()
  const stEth = ContractStEth.useRpc()
  const emergencyProtectedTimelock = ContractEmergencyProtectedTimelock.useRpc()
  const { getRpcUrl } = useConfig()

  return useLidoSWR(
    ['swr:useDualGovernanceState', chainId],
    async (_, _chainId: CHAINS) => {
      const rpcUrl = getRpcUrl(_chainId)
      const library = getStaticRpcBatchProvider(_chainId, rpcUrl)

      const vetoSignallingAddress =
        await dualGovernance.getVetoSignallingEscrow()

      const VetoSignallingEscrow = DGEscrowAbi__factory.connect(
        vetoSignallingAddress,
        library,
      )
      const lockedAssets =
        await VetoSignallingEscrow.getSignallingEscrowDetails()

      const unfinalizedShares = lockedAssets.totalStETHLockedShares.add(
        lockedAssets.totalUnstETHUnfinalizedShares,
      )

      const pooledEthByShares = await stEth.getPooledEthByShares(
        unfinalizedShares,
      )

      const totalStEthInEscrow = pooledEthByShares.add(
        lockedAssets.totalUnstETHFinalizedETH,
      )

      const rageQuitSupport = await VetoSignallingEscrow.getRageQuitSupport()

      const effectiveState = await dualGovernance.getEffectiveState()

      const proposalsCount = await getActiveProposalsCount(
        dualGovernance,
        emergencyProtectedTimelock,
      )

      return {
        totalStEthInEscrow,
        rageQuitSupport,
        effectiveState,
        proposalsCount,
        // timelock till
        // proposals count
      }
      // const rageQuitAddress = await dualGovernance.getRageQuitEscrow()
    },
  )
}
