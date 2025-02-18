export const DualGovernanceStatus = {
  Normal: 'Normal',
  Warning: 'Warning',
  Deactivation: 'Deactivation',
  VetoSignalling: 'VetoSignalling',
  RageQuit: 'RageQuit',
  Cooldown: 'Cooldown',
} as const

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DualGovernanceStatus = keyof typeof DualGovernanceStatus

export enum DualGovernanceState {
  Unset,
  Normal,
  VetoSignalling,
  VetoSignallingDeactivation,
  VetoCooldown,
  RageQuit,
}
