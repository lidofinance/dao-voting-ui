import {
  addSpacesBeforeUpperCase,
  getDualGovernanceStateLabel,
} from '../../utils'
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

  const hasProposals = proposalsCount > 0

  const showProposalsInfo =
    hasProposals &&
    dgStatus !== DualGovernanceStatus.Normal &&
    dgStatus !== DualGovernanceStatus.Cooldown

  const showState =
    dgStatus === DualGovernanceStatus.VetoSignalling ||
    dgStatus === DualGovernanceStatus.Deactivation ||
    dgStatus === DualGovernanceStatus.RageQuit

  const showTimelock =
    hasProposals &&
    dgStatus !== DualGovernanceStatus.Normal &&
    dgStatus !== DualGovernanceStatus.RageQuit

  const showNextState =
    dgStatus === DualGovernanceStatus.RageQuit ||
    dgStatus === DualGovernanceStatus.Cooldown

  return (
    <DualGovernanceWidgetWrapper>
      {/* Governance State */}
      <p>
        <Label $size={14} $weight={700}>
          Governance
        </Label>
        <Label>
          <StatusBulb $status={dgStatus} />
          {getDualGovernanceStateLabel(dgStatus)}
        </Label>
      </p>
      {showState && (
        <p>
          <Label>State</Label>
          <Label>{addSpacesBeforeUpperCase(dgStatus)}</Label>
        </p>
      )}
      {/* Veto Support */}
      <p>
        <Label>Veto Support</Label>
        <p>
          <Label $color="secondary">103k</Label>
          <Label>1%</Label>
        </p>
      </p>

      {/* Conditional information */}
      {showTimelock && (
        <p>
          <Label>Timelock till</Label>
          <Label>Sep 3, 5:15 PM GMT+3</Label>
        </p>
      )}
      {showNextState && (
        <p>
          <Label>Next state</Label>
          <Label>Cooldown</Label>
        </p>
      )}
      {dgStatus === DualGovernanceStatus.Deactivation && (
        <p>
          <Label>stETH needed to Veto Signalling</Label>
          <Label>118k</Label>
        </p>
      )}
      {/* Proposals */}
      {showProposalsInfo && (
        <p>
          <Label $color="secondary">
            {proposalsCount} proposal{proposalsCount > 1 ? 's' : ''}
            {dgStatus === DualGovernanceStatus.Deactivation
              ? ' currently blocked in Dual Governance will remain so only if 118k stETH (1.3%) is added'
              : ' pending in Dual Governance'}
          </Label>
        </p>
      )}
      <CheckLink href={DG_LINK} target="_blank" rel="noreferrer">
        Go to Dual Governance
      </CheckLink>
    </DualGovernanceWidgetWrapper>
  )
}
