import { useLidoSWR } from '@lido-sdk/react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { CHAINS } from '@lido-sdk/constants'

import {
  DGConfigProviderAbi__factory,
  DGEscrowAbi__factory,
  DualGovernanceAbi,
  EmergencyProtectedTimelockAbi,
} from 'generated'
import { useConfig } from 'modules/config/hooks/useConfig'
import { getStaticRpcBatchProvider } from '@lido-sdk/providers'
import { useContractHelpers } from 'modules/blockChain/hooks/useContractHelpers'
import { DualGovernanceStatus } from 'modules/dual-governance/types'

const NORMAL_WARNING_STATE_THRESHOLD_PERCENT = 33

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
  const {
    dualGovernanceHelpers,
    stEthHelpers,
    emergencyProtectedTimelockHelpers,
  } = useContractHelpers()
  const dualGovernance = dualGovernanceHelpers.useRpc()
  const stEth = stEthHelpers.useRpc()
  const emergencyProtectedTimelock = emergencyProtectedTimelockHelpers.useRpc()
  const { getRpcUrl } = useConfig()

  return useLidoSWR(
    ['swr:useDualGovernanceState', chainId],
    async (_, _chainId: CHAINS) => {
      const rpcUrl = getRpcUrl(_chainId)
      const library = getStaticRpcBatchProvider(_chainId, rpcUrl)

      const vetoSignallingAddress =
        await dualGovernance.getVetoSignallingEscrow()
      const configAddress = await dualGovernance.getConfigProvider()

      const VetoSignallingEscrow = DGEscrowAbi__factory.connect(
        vetoSignallingAddress,
        library,
      )

      const dgConfig = DGConfigProviderAbi__factory.connect(
        configAddress,
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

      let dgStatus = await dualGovernance.getPersistedState()
      const nextDgStatus = await dualGovernance.getEffectiveState()

      const proposalsCount = await getActiveProposalsCount(
        dualGovernance,
        emergencyProtectedTimelock,
      )

      const dualGovernanceConfig = await dgConfig.getDualGovernanceConfig()

      const { firstSealRageQuitSupport } = dualGovernanceConfig

      const warningStateThreshold = firstSealRageQuitSupport
        .mul(NORMAL_WARNING_STATE_THRESHOLD_PERCENT)
        .div(100)

      if (rageQuitSupport >= warningStateThreshold) {
        dgStatus = DualGovernanceStatus.Warning
      }

      return {
        totalStEthInEscrow,
        rageQuitSupport,
        dgStatus,
        proposalsCount,
        firstSealRageQuitSupport,
        nextDgStatus,
        // timelock till
        // proposals count
      }
      // const rageQuitAddress = await dualGovernance.getRageQuitEscrow()
    },
  )
}
