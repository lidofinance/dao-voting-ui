import { BigNumber } from 'ethers'

export enum DualGovernanceStatus {
  Unset,
  Normal,
  VetoSignalling,
  VetoSignallingDeactivation,
  VetoCooldown,
  RageQuit,
  Warning, // UI only state
  EmergencyMode, // UI only state
}

export type DualGovernanceConfig = {
  firstSealRageQuitSupport: BigNumber
  secondSealRageQuitSupport: BigNumber
  minAssetsLockDuration: number
  vetoSignallingMinDuration: number
  vetoSignallingMaxDuration: number
  vetoSignallingMinActiveDuration: number
  vetoSignallingDeactivationMaxDuration: number
  vetoCooldownDuration: number
  rageQuitExtensionPeriodDuration: number
  rageQuitEthWithdrawalsMinDelay: number
  rageQuitEthWithdrawalsMaxDelay: number
  rageQuitEthWithdrawalsDelayGrowth: number
}

export type DualGovernanceStateDetails = {
  effectiveState: number
  persistedState: number
  persistedStateEnteredAt: number
  vetoSignallingActivatedAt: number
  vetoSignallingReactivationTime: number
  normalOrVetoCooldownExitedAt: number
  rageQuitRound: BigNumber
  vetoSignallingDuration: number
}

export type DualGovernanceState = {
  status: number
  nextStatus: number
  totalStEthInEscrow: BigNumber
  totalSupply: BigNumber
  rageQuitSupportPercent: BigNumber
  activeProposalsCount: number
  config: DualGovernanceConfig
  stateDetails: DualGovernanceStateDetails
  firstSealRageQuitSupport: BigNumber
  amountUntilVetoSignalling: {
    percentage: string
    value: string
  } | null
}

export enum ProposalStatus {
  NotExist,
  Submitted,
  Scheduled,
  Executed,
  Cancelled,
}
