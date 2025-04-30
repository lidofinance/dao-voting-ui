import {
  getDualGovernanceStatusLabel,
  getDualGovernanceLink,
  stringifyDualGovernanceStatus,
  formatPercent16,
} from '../utils'
import { DualGovernanceState, DualGovernanceStatus } from '../types'
import {
  CheckLink,
  DualGovernanceWidgetWrapper,
  Label,
  StatusBulb,
} from './DualGovernanceWidgetStyle'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { formatBalance } from 'modules/blockChain/utils/formatBalance'

type Props = {
  dualGovernanceState: DualGovernanceState
}

export const DualGovernanceWidget = ({ dualGovernanceState }: Props) => {
  const { chainId } = useWeb3()

  const {
    status,
    activeProposalsCount,
    totalStEthInEscrow,
    rageQuitSupportPercent,
    nextStatus,
    amountUntilVetoSignalling,
  } = dualGovernanceState

  const hasProposals = !!activeProposalsCount

  const showProposalsInfo =
    hasProposals &&
    status !== DualGovernanceStatus.Normal &&
    status !== DualGovernanceStatus.VetoCooldown

  const showState =
    status === DualGovernanceStatus.VetoSignalling ||
    status === DualGovernanceStatus.VetoSignallingDeactivation ||
    status === DualGovernanceStatus.RageQuit

  const showNextState =
    status !== nextStatus &&
    (status === DualGovernanceStatus.RageQuit ||
      status === DualGovernanceStatus.VetoCooldown)

  return (
    <DualGovernanceWidgetWrapper>
      {/* Governance State */}
      <p>
        <Label $size={14} $weight={700}>
          Governance
        </Label>
        <Label>
          <StatusBulb $status={status} />
          {getDualGovernanceStatusLabel(status)}
        </Label>
      </p>
      {showState && (
        <p>
          <Label>State</Label>
          <Label>{stringifyDualGovernanceStatus(status)}</Label>
        </p>
      )}
      {/* Veto Support */}
      {status !== DualGovernanceStatus.RageQuit && (
        <p>
          <Label>Veto Support</Label>
          <p>
            {!totalStEthInEscrow.isZero() && (
              <Label $color="secondary">
                {formatBalance(totalStEthInEscrow)} stETH
              </Label>
            )}
            <Label>{formatPercent16(rageQuitSupportPercent)}%</Label>
          </p>
        </p>
      )}

      {/* Conditional information */}
      {showNextState && (
        <p>
          <Label>Next state</Label>
          <Label>{stringifyDualGovernanceStatus(nextStatus)}</Label>
        </p>
      )}
      {amountUntilVetoSignalling && (
        <p>
          <Label>stETH needed to Veto Signalling</Label>
          <Label>{amountUntilVetoSignalling.value}</Label>
        </p>
      )}
      {/* Proposals */}
      {showProposalsInfo && (
        <p>
          <Label $color="secondary">
            {amountUntilVetoSignalling ? (
              <>
                {activeProposalsCount} proposal
                {activeProposalsCount > 1 ? 's' : ''}{' '}
                {activeProposalsCount > 1 ? 'are ' : 'is '}currently blocked in
                Dual Governance will remain so only if
                {amountUntilVetoSignalling.value} stETH (
                {amountUntilVetoSignalling.percentage}%) is added
              </>
            ) : (
              <>
                {activeProposalsCount} pending proposal
                {activeProposalsCount > 1 ? 's' : ''} in Dual Governance
              </>
            )}
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
