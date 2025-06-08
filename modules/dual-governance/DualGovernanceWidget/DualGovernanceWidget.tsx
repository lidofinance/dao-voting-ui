import {
  getDualGovernanceStatusLabel,
  getDualGovernanceLink,
  stringifyDualGovernanceStatus,
  parsePercent16,
} from '../utils'
import { DualGovernanceState, DualGovernanceStatus } from '../types'
import {
  CheckLink,
  DualGovernanceWidgetWrapper,
  Label,
  StatusBulb,
} from './DualGovernanceWidgetStyle'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { formatEther } from 'ethers/lib/utils'
import { Box } from '@lidofinance/lido-ui'

type Props = {
  dualGovernanceState: DualGovernanceState
}

const formatNumber = (value: number): string => {
  if (value === 0) return '0'
  if (value < 1000) return value.toFixed(1)
  if (value < 1000000) {
    const inThousands = value / 1000
    return inThousands.toFixed(1) + 'k'
  }
  const inMillions = value / 1000000
  return inMillions.toFixed(1) + 'M'
}

export const DualGovernanceWidget = ({ dualGovernanceState }: Props) => {
  const { chainId } = useWeb3()

  const {
    status,
    activeProposalsCount,
    totalStEthInEscrow,
    nextStatus,
    amountUntilVetoSignalling,
    firstSealRageQuitSupport,
    totalSupply,
    rageQuitSupportPercent,
  } = dualGovernanceState

  const hasProposals = !!activeProposalsCount
  const showProposalsInfo =
    hasProposals &&
    status !== DualGovernanceStatus.Normal &&
    status !== DualGovernanceStatus.VetoCooldown

  const firstSealRageQuitSupportPercent = parsePercent16(
    firstSealRageQuitSupport,
  )

  const firstSealRageQuitSupportAmount = formatEther(
    totalSupply.div(100).mul(firstSealRageQuitSupportPercent),
  )

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
        <Box display="flex" justifyContent="space-between">
          <Label>Veto Support</Label>
          <p>
            {!totalStEthInEscrow.isZero() && (
              <Label $color="secondary">
                {formatNumber(Number(formatEther(totalStEthInEscrow)))} /{' '}
                {formatNumber(Number(firstSealRageQuitSupportAmount))}
              </Label>
            )}
          </p>
        </Box>
      )}
      {/* RQ Support */}
      {status === DualGovernanceStatus.VetoSignalling && (
        <Box display="flex" justifyContent="space-between">
          <Label>RageQuit threshold</Label>
          <p>
            {parsePercent16(rageQuitSupportPercent) && (
              <Label $color="secondary">
                {parsePercent16(rageQuitSupportPercent)}%
              </Label>
            )}
          </p>
        </Box>
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
