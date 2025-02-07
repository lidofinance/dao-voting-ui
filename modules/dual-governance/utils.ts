import { DualGovernanceStatus } from './types'

export const getDualGovernanceStateLabel = (status: DualGovernanceStatus) => {
  switch (status) {
    case DualGovernanceStatus.VetoSignalling:
    case DualGovernanceStatus.RageQuit:
    case DualGovernanceStatus.Deactivation:
      return 'Blocked'
    case DualGovernanceStatus.Cooldown:
      return 'Cooldown'
    case DualGovernanceStatus.Warning:
    case DualGovernanceStatus.Normal:
    default:
      return 'Normal'
  }
}

export const getBulbColor = (status: DualGovernanceStatus) => {
  switch (status) {
    case DualGovernanceStatus.VetoSignalling:
    case DualGovernanceStatus.RageQuit:
      return 'rgba(214, 72, 90, 1)'
    case DualGovernanceStatus.Deactivation:
      return 'rgba(252, 97, 62, 1)'
    case DualGovernanceStatus.Warning:
      return 'rgba(255, 154, 1, 1)'
    case DualGovernanceStatus.Cooldown:
      return 'rgba(72, 84, 255, 1)'
    case DualGovernanceStatus.Normal:
    default:
      return 'rgba(53, 192, 139, 1)'
  }
}

export const addSpacesBeforeUpperCase = (value: string) => {
  return value.replace(/(?!^)[A-Z]/g, ' $&')
}
