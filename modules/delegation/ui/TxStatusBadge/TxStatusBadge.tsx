import React, { FC, useMemo } from 'react'
import { Text, Tooltip } from '@lidofinance/lido-ui'
import { Wrap } from './TxStatusBadgeStyle'
import { TxStatus } from 'modules/blockChain/types'

import SuccessSvg from 'assets/check.com.svg.react'
import WarningSvg from 'assets/warning.com.svg.react'
import FailSvg from 'assets/fail.com.svg.react'

type Status = TxStatus | 'warning'

type Props = {
  status: Status
  onClick?: () => void
}

export const TxStatusBadge: FC<Props> = ({ status, onClick }) => {
  const { text, color, Icon } = useMemo(() => {
    switch (status) {
      case 'failed':
        return { text: 'Failed', color: 'error', Icon: FailSvg }
      case 'warning':
        return {
          text: 'Dropped & Replaced',
          color: 'warning',
          Icon: WarningSvg,
        }
      case 'success':
        return { text: 'Success', color: 'success', Icon: SuccessSvg }
      case 'pending':
        return { text: 'Pending...', color: 'primary', Icon: null }
      default:
      case 'empty':
        return { text: 'Not started', color: 'secondary', Icon: null }
    }
  }, [status])

  if (status === 'empty') {
    return (
      <Wrap $color={color} $clickable={false} onClick={onClick}>
        {Icon && <Icon />}
        <Text as="span" size="xxs" weight={700}>
          {text}
        </Text>
      </Wrap>
    )
  }

  return (
    <Tooltip placement="top" title={<span>show on etherscan</span>}>
      <Wrap $color={color} $clickable onClick={onClick}>
        {Icon && <Icon />}
        <Text as="span" size="xxs" weight={700}>
          {text}
        </Text>
      </Wrap>
    </Tooltip>
  )
}
