import {
  getDualGovernanceLink,
  getDualGovernanceStatusLabel,
  parsePercent16,
  stringifyDualGovernanceStatus,
} from '../utils'
import { DualGovernanceState, DualGovernanceStatus } from '../types'
import {
  CheckLink,
  DualGovernanceWidgetWrapper,
  Label,
  StatusBulb,
} from './DualGovernanceWidgetStyle'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { Box } from '@lidofinance/lido-ui'
import { formatBalance } from '../../blockChain/utils/formatBalance'

type Props = {
  dualGovernanceState: DualGovernanceState
}

export const DualGovernanceWidget = ({ dualGovernanceState }: Props) => {
  const { chainId } = useWeb3()

  const {
    status,
    activeProposalsCount,
    totalStEthInEscrow,
    nextStatus,
    amountUntilVetoSignalling,
    totalSupply,
    secondSealRageQuitSupport,
  } = dualGovernanceState

  const secondSealRageQuitSupportPercent = parsePercent16(
    secondSealRageQuitSupport,
  )

  const calculateRQThresholdPercent = () => {
    if (
      !secondSealRageQuitSupportPercent ||
      secondSealRageQuitSupportPercent <= 0 ||
      totalStEthInEscrow.isNegative()
    ) {
      return 0
    }

    const targetValue = totalSupply
      .mul(secondSealRageQuitSupportPercent)
      .div(100)

    if (targetValue.isZero()) {
      return totalStEthInEscrow.gt(0) ? 100 : 0
    }

    const scaleFactor = 10000
    const percentBN = totalStEthInEscrow
      .mul(scaleFactor)
      .mul(100)
      .div(targetValue)

    let thresholdSupportPercent =
      Number(percentBN.toString()) / Number(scaleFactor)

    if (thresholdSupportPercent > 100) {
      thresholdSupportPercent = 100
    }
    if (thresholdSupportPercent < 0) {
      thresholdSupportPercent = 0
    }

    return thresholdSupportPercent
  }

  const rageQuitThresholdPercent = calculateRQThresholdPercent()

  const formattedRageQuitThresholdPercent = rageQuitThresholdPercent.toFixed(1)

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
        <Box display="flex" justifyContent="space-between">
          <Label>Veto Support</Label>
          <p>
            <Label $color="secondary">
              {formatBalance(totalStEthInEscrow, 1)} /{' '}
              {formatBalance(totalSupply, 1)}
            </Label>
          </p>
        </Box>
      )}
      {/* RQ Support */}
      {status === DualGovernanceStatus.VetoSignalling && (
        <Box display="flex" justifyContent="space-between">
          <Label>RageQuit threshold</Label>
          <p>
            <Label $color="secondary">
              {formattedRageQuitThresholdPercent}%
            </Label>
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
