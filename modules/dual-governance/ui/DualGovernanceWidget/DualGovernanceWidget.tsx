import { getDualGovernanceStateLabel } from '../../utils'
import { DualGovernanceStatus } from '../../types'
import {
  CheckLink,
  DualGovernanceWidgetWrapper,
  Label,
  StatusBulb,
} from './DualGovernanceWidgetStyle'

const STATUS: any = DualGovernanceStatus.Normal
const PROPOSALS_COUNT = 3
const DG_LINK = 'https://dg-holesky.testnet.fi/'

export const DualGovernanceWidget = () => {
  const dgStatus: DualGovernanceStatus = STATUS
  const proposalsCount: number = PROPOSALS_COUNT

  const showProposalsInfo =
    dgStatus === DualGovernanceStatus.Deactivation ||
    dgStatus === DualGovernanceStatus.VetoSignalling ||
    dgStatus === DualGovernanceStatus.Warning
  return (
    <DualGovernanceWidgetWrapper>
      {/* Governance State */}
      <p>
        <Label $size={14} $weight={700}>
          Governance State
        </Label>
        <Label>
          <StatusBulb $status={dgStatus} />
          {getDualGovernanceStateLabel(dgStatus)}
        </Label>
      </p>
      {/* Veto Support */}
      <p>
        <Label>Veto support</Label>
        <p>
          <Label $color="secondary">103k</Label>
          <Label>1%</Label>
        </p>
      </p>
      {/* Proposals */}
      {showProposalsInfo && (
        <p>
          <Label>
            {dgStatus === DualGovernanceStatus.VetoSignalling
              ? 'Blocked'
              : 'Active'}{' '}
            in DG
          </Label>
          <Label>
            {proposalsCount} proposal{proposalsCount > 1 ? 's' : ''}
          </Label>
        </p>
      )}
      {/* Conditional information */}
      {dgStatus === DualGovernanceStatus.Warning && (
        <p>
          <Label>DG Timelock ends</Label>
          <Label>Sep 3, 5:15 PM GMT+3</Label>
        </p>
      )}
      {dgStatus === DualGovernanceStatus.Deactivation && (
        <p>
          <Label>Deactivation ends</Label>
          <Label>Sep 3, 5:15 PM GMT+3</Label>
        </p>
      )}
      {dgStatus === DualGovernanceStatus.VetoSignalling && (
        <Label color="secondary">
          RageQuit starts in 13:34:55 if 3.97% more stETH is added
        </Label>
      )}
      {dgStatus === DualGovernanceStatus.Cooldown && (
        <p>
          <Label>Cooldown ends</Label>
          <Label>Sep 3, 5:15 PM GMT+3</Label>
        </p>
      )}
      {dgStatus === DualGovernanceStatus.RageQuit && (
        <Label>RageQuit in progress</Label>
      )}
      <CheckLink href={DG_LINK} target="_blank" rel="noreferrer">
        Check
      </CheckLink>
    </DualGovernanceWidgetWrapper>
  )
}
