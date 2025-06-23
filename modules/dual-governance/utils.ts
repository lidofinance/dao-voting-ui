import { CHAINS } from '@lido-sdk/constants'
import {
  DualGovernanceConfig,
  DualGovernanceStateDetails,
  DualGovernanceStatus,
} from './types'
import { BigNumber, utils } from 'ethers'

export const getDualGovernanceStatusLabel = (status: DualGovernanceStatus) => {
  switch (status) {
    case DualGovernanceStatus.VetoSignalling:
    case DualGovernanceStatus.RageQuit:
    case DualGovernanceStatus.VetoSignallingDeactivation:
    case DualGovernanceStatus.EmergencyMode:
      return 'Blocked'
    case DualGovernanceStatus.VetoCooldown:
      return 'Cooldown'
    case DualGovernanceStatus.Warning:
    case DualGovernanceStatus.Normal:
    default:
      return 'Normal'
  }
}

export const stringifyDualGovernanceStatus = (status: DualGovernanceStatus) => {
  switch (status) {
    case DualGovernanceStatus.EmergencyMode:
      return 'Emergency Mode'
    case DualGovernanceStatus.Unset:
      return 'Unset'
    case DualGovernanceStatus.Normal:
      return 'Normal'
    case DualGovernanceStatus.VetoSignalling:
      return 'Veto Signalling'
    case DualGovernanceStatus.VetoSignallingDeactivation:
      return 'Deactivation'
    case DualGovernanceStatus.VetoCooldown:
      return 'Cooldown'
    case DualGovernanceStatus.RageQuit:
      return 'Rage Quit'
    case DualGovernanceStatus.Warning:
      return 'Warning'
    default:
      return 'Unknown'
  }
}

export const getDualGovernanceBannerColor = (status: DualGovernanceStatus) => {
  switch (status) {
    case DualGovernanceStatus.Unset:
      return 'gray' // TODO - add a color for this status
    case DualGovernanceStatus.VetoSignalling:
    case DualGovernanceStatus.RageQuit:
    case DualGovernanceStatus.EmergencyMode:
      return 'rgba(214, 72, 90, 1)'
    case DualGovernanceStatus.VetoSignallingDeactivation:
      return 'rgba(252, 97, 62, 1)'
    case DualGovernanceStatus.Warning:
      return 'rgba(255, 154, 1, 1)'
    case DualGovernanceStatus.VetoCooldown:
      return 'rgba(72, 84, 255, 1)'
    case DualGovernanceStatus.Normal:
    default:
      return 'rgba(53, 192, 139, 1)'
  }
}

// TODO: move to ENV
export const getDualGovernanceLink = (chainId: CHAINS) => {
  switch (chainId) {
    case CHAINS.Holesky:
      return 'https://dg-holesky.testnet.fi/'
    case CHAINS.Hoodi:
      return 'https://dg-hoodi.testnet.fi/'
    default:
      return 'https://dg.lido.fi/'
  }
}

export const formatNumber = (value: number) => {
  if (isNaN(value)) {
    return 'N/A'
  }

  const formattedNumber = value.toLocaleString('en-US', {
    notation: 'standard',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

  return formattedNumber
}

export const parsePercent16 = (value: BigNumber | null | undefined) => {
  if (value === null || value === undefined) return NaN

  return parseFloat(utils.formatUnits(value, 16))
}

export const formatPercent16 = (value: BigNumber | null | undefined) => {
  return formatNumber(parsePercent16(value))
}

export const getAmountUntilVetoSignalling = (
  stateDetails: DualGovernanceStateDetails,
  dgConfigDetails: DualGovernanceConfig,
  stEthTotalSupply: BigNumber,
) => {
  const currentTimestamp = Math.floor(Date.now() / 1000)
  const { persistedStateEnteredAt } = stateDetails
  const {
    firstSealRageQuitSupport,
    secondSealRageQuitSupport,
    vetoSignallingMinDuration,
    vetoSignallingMaxDuration,
  } = dgConfigDetails

  const timestampDiff =
    currentTimestamp - persistedStateEnteredAt - vetoSignallingMinDuration

  if (timestampDiff < 0) {
    // edge case
    return null
  }

  // We use this timestamp to add a hardcoded gap of 3 hours to the approximate VetoSignalling restart date
  const futureTimestamp = currentTimestamp + 3 * 3600

  const firstThreshold = parsePercent16(firstSealRageQuitSupport)
  const secondThreshold = parsePercent16(secondSealRageQuitSupport)

  const thresholdDiff = secondThreshold - firstThreshold
  const durationDiff = vetoSignallingMaxDuration - vetoSignallingMinDuration

  const totalSupplyPercentage =
    (thresholdDiff *
      (currentTimestamp + futureTimestamp + persistedStateEnteredAt)) /
    durationDiff

  if (totalSupplyPercentage > secondThreshold || totalSupplyPercentage < 0) {
    // edge case
    return null
  }

  const formattedValue = formatNumber(
    parseFloat(
      utils.formatEther(stEthTotalSupply.mul(totalSupplyPercentage).div(100)),
    ),
  )
  const formattedPercentage = formatNumber(totalSupplyPercentage)

  return {
    percentage: formattedPercentage,
    value: formattedValue,
  }
}
