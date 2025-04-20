import {
  getDualGovernanceStatusLabel,
  getDualGovernanceLink,
  stringifyDualGovernanceStatus,
} from '../../utils'
import { DualGovernanceStatus } from '../../types'
import {
  CheckLink,
  DualGovernanceWidgetWrapper,
  Label,
  StatusBulb,
} from './DualGovernanceWidgetStyle'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useDualGovernanceState } from './useDualGovernanceState'

export const DualGovernanceWidget = () => {
  const { chainId } = useWeb3()

  const { data: dgState, initialLoading } = useDualGovernanceState()

  const hasProposals = !!dgState?.proposalsCount

  if (initialLoading || !dgState) {
    return null
  }

  const {
    dgStatus,
    proposalsCount,
    totalStEthInEscrow,
    firstSealRageQuitSupport,
    nextDgStatus,
  } = dgState

  const showProposalsInfo =
    hasProposals &&
    dgStatus !== DualGovernanceStatus.Normal &&
    dgStatus !== DualGovernanceStatus.VetoCooldown

  const showState =
    dgStatus === DualGovernanceStatus.VetoSignalling ||
    dgStatus === DualGovernanceStatus.VetoSignallingDeactivation ||
    dgStatus === DualGovernanceStatus.RageQuit

  const showTimelock =
    hasProposals &&
    dgStatus !== DualGovernanceStatus.Normal &&
    dgStatus !== DualGovernanceStatus.RageQuit

  const showNextState =
    dgStatus === DualGovernanceStatus.RageQuit ||
    dgStatus === DualGovernanceStatus.VetoCooldown

  return (
    <DualGovernanceWidgetWrapper>
      {/* Governance State */}
      <p>
        <Label $size={14} $weight={700}>
          Governance
        </Label>
        <Label>
          <StatusBulb $status={dgStatus} />
          {getDualGovernanceStatusLabel(dgStatus)}
        </Label>
      </p>
      {showState && (
        <p>
          <Label>State</Label>
          <Label>{stringifyDualGovernanceStatus(dgStatus)}</Label>
        </p>
      )}
      {/* Veto Support */}
      <p>
        <Label>Veto Support</Label>
        <p>
          <Label $color="secondary">{totalStEthInEscrow.toString()}</Label>
          <Label>{firstSealRageQuitSupport.toString()}%</Label>
        </p>
      </p>

      {/* Conditional information */}
      {showTimelock && (
        <p>
          <Label>Timelock till</Label>
          {/* TODO  */}
          <Label>Sep 3, 5:15 PM GMT+3</Label>
        </p>
      )}
      {showNextState && (
        <p>
          <Label>Next state</Label>
          <Label>{getDualGovernanceStatusLabel(nextDgStatus)}</Label>
        </p>
      )}
      {dgStatus === DualGovernanceStatus.VetoSignallingDeactivation && (
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
            {dgStatus === DualGovernanceStatus.VetoSignallingDeactivation
              ? ' currently blocked in Dual Governance will remain so only if 118k stETH (1.3%) is added'
              : ' pending in Dual Governance'}
          </Label>
        </p>
      )}
      <CheckLink
        href={getDualGovernanceLink(chainId)}
        target="_blank"
        rel="noreferrer"
      >
        Go to Dual Governance
      </CheckLink>
    </DualGovernanceWidgetWrapper>
  )
}
