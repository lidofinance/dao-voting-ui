import { useLidoSWRImmutable } from '@lido-sdk/react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { CHAINS } from '@lido-sdk/constants'

import { DGConfigProviderAbi__factory, DGEscrowAbi__factory } from 'generated'
import { useConfig } from 'modules/config/hooks/useConfig'
import { getStaticRpcBatchProvider } from '@lido-sdk/providers'
import { useContractHelpers } from 'modules/blockChain/hooks/useContractHelpers'
import {
  DualGovernanceState,
  DualGovernanceStatus,
} from 'modules/dual-governance/types'
import { getAmountUntilVetoSignalling } from './utils'

const WARNING_STATE_THRESHOLD_PERCENT = 33

export const useDualGovernanceState = () => {
  const { chainId } = useWeb3()
  const { getRpcUrl } = useConfig()

  const {
    dualGovernanceHelpers,
    stEthHelpers,
    emergencyProtectedTimelockHelpers,
  } = useContractHelpers()

  const dualGovernance = dualGovernanceHelpers.useRpc()
  const stEth = stEthHelpers.useRpc()
  const emergencyProtectedTimelock = emergencyProtectedTimelockHelpers.useRpc()

  return useLidoSWRImmutable<DualGovernanceState>(
    ['swr:useDualGovernanceState', chainId],
    async (_: any, _chainId: CHAINS) => {
      const rpcUrl = getRpcUrl(_chainId)
      const provider = getStaticRpcBatchProvider(_chainId, rpcUrl)

      const vetoSignallingAddress =
        await dualGovernance.getVetoSignallingEscrow()
      const configAddress = await dualGovernance.getConfigProvider()
      const stateDetails = await dualGovernance.getStateDetails()

      const vetoSignallingEscrow = DGEscrowAbi__factory.connect(
        vetoSignallingAddress,
        provider,
      )

      const dualGovernanceConfig = DGConfigProviderAbi__factory.connect(
        configAddress,
        provider,
      )

      const lockedAssets =
        await vetoSignallingEscrow.getSignallingEscrowDetails()
      const rageQuitSupportPercent =
        await vetoSignallingEscrow.getRageQuitSupport()

      const unfinalizedShares = lockedAssets.totalStETHLockedShares.add(
        lockedAssets.totalUnstETHUnfinalizedShares,
      )

      const totalSupply = await stEth.totalSupply()
      const pooledEthByShares = await stEth.getPooledEthByShares(
        unfinalizedShares,
      )

      const totalStEthInEscrow = pooledEthByShares.add(
        lockedAssets.totalUnstETHFinalizedETH,
      )

      let status = stateDetails.persistedState

      let activeProposalsCount = 0
      if (
        status !== DualGovernanceStatus.Normal &&
        status !== DualGovernanceStatus.VetoCooldown
      ) {
        const proposalsCount = (
          await emergencyProtectedTimelock.getProposalsCount()
        ).toNumber()
        for (let i = 1; i <= proposalsCount; i++) {
          const proposal = await emergencyProtectedTimelock.getProposal(i)
          if (
            proposal.proposalDetails.status === 1 ||
            proposal.proposalDetails.status === 2
          ) {
            activeProposalsCount++
          }
        }
      }

      const config = await dualGovernanceConfig.getDualGovernanceConfig()

      const { firstSealRageQuitSupport } = config

      const warningStateThreshold = firstSealRageQuitSupport
        .mul(WARNING_STATE_THRESHOLD_PERCENT)
        .div(100)

      if (
        status === DualGovernanceStatus.Normal &&
        rageQuitSupportPercent.gte(warningStateThreshold)
      ) {
        status = DualGovernanceStatus.Warning
      }

      let amountUntilVetoSignalling: {
        percentage: string
        value: string
      } | null = null
      if (status === DualGovernanceStatus.VetoSignallingDeactivation) {
        amountUntilVetoSignalling = getAmountUntilVetoSignalling(
          stateDetails,
          config,
          totalSupply,
        )
      }

      return {
        status,
        nextStatus: stateDetails.effectiveState,
        totalStEthInEscrow,
        rageQuitSupportPercent,
        activeProposalsCount,
        config,
        stateDetails,
        amountUntilVetoSignalling,
      }
    },
  )
}
