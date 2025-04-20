import { CHAINS } from '@lido-sdk/constants'
import { DualGovernanceStatus } from './types'

export const getDualGovernanceStatusLabel = (status: DualGovernanceStatus) => {
  switch (status) {
    case DualGovernanceStatus.VetoSignalling:
    case DualGovernanceStatus.RageQuit:
    case DualGovernanceStatus.VetoSignallingDeactivation:
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

export const getBulbColor = (status: DualGovernanceStatus) => {
  switch (status) {
    case DualGovernanceStatus.VetoSignalling:
    case DualGovernanceStatus.RageQuit:
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
