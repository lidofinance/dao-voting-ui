import { Text } from '@lidofinance/lido-ui'
import { useDelegationFormData } from 'modules/delegation/providers/DelegationFormContext'
import {
  LabelWithIcon,
  RetryButton,
  StatusWrap,
  Wrap,
} from './DelegationTxStatusStyle'
import { TxStatusBadge } from '../../TxStatusBadge'

import AragonSvg from 'assets/aragon.com.svg.react'
import SnapshotSvg from 'assets/snapshot.com.svg.react'

export function DelegationTxStatus() {
  const { mode, txAragonDelegate, txSnapshotDelegate } = useDelegationFormData()

  if (mode === 'simple') {
    if (txAragonDelegate.isEmpty && txSnapshotDelegate.isEmpty) {
      return null
    }

    return (
      <div>
        <Wrap>
          <LabelWithIcon>
            <AragonSvg />
            <Text size="xxs" color="secondary">
              Aragon tx status
            </Text>
          </LabelWithIcon>
          <StatusWrap>
            <TxStatusBadge
              status={txAragonDelegate.status}
              type={txAragonDelegate.tx?.type}
              onClick={txAragonDelegate.open}
            />
            {txAragonDelegate.isFailed && (
              <RetryButton onClick={txAragonDelegate.send} />
            )}
          </StatusWrap>
        </Wrap>
        <Wrap>
          <LabelWithIcon>
            <SnapshotSvg />
            <Text size="xxs" color="secondary">
              Snapshot tx status
            </Text>
          </LabelWithIcon>
          <StatusWrap>
            <TxStatusBadge
              status={txSnapshotDelegate.status}
              type={txSnapshotDelegate.tx?.type}
              onClick={txSnapshotDelegate.open}
            />
            {txSnapshotDelegate.isFailed && (
              <RetryButton onClick={txSnapshotDelegate.send} />
            )}
          </StatusWrap>
        </Wrap>
      </div>
    )
  }

  const tx = mode === 'aragon' ? txAragonDelegate : txSnapshotDelegate

  if (tx.isEmpty) {
    return null
  }

  return (
    <Wrap>
      <Text size="xxs" color="secondary">
        Tx status
      </Text>
      <StatusWrap>
        <TxStatusBadge
          status={tx.status}
          type={tx.tx?.type}
          onClick={tx.open}
        />
        {tx.isFailed && <RetryButton onClick={tx.send} />}
      </StatusWrap>
    </Wrap>
  )
}
