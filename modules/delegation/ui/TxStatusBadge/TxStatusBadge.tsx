import React, { FC, useMemo } from 'react'
import { Text, Tooltip } from '@lidofinance/lido-ui'
import { ExplorerButton, Wrap } from './TxStatusBadgeStyle'
import { TxStatus } from 'modules/blockChain/types'

import SuccessSvg from 'assets/check.com.svg.react'
import WarningSvg from 'assets/warning.com.svg.react'
import FailSvg from 'assets/fail.com.svg.react'

type Status = TxStatus | 'warning'

type Props = {
  status: Status
  type: 'regular' | 'safe' | undefined
  onClick?: () => void
}

export const TxStatusBadge: FC<Props> = ({ status, type, onClick }) => {
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
        if (type === 'safe') {
          return {
            text: 'Signed',
            color: 'success',
            Icon: SuccessSvg,
          }
        }
        return { text: 'Success', color: 'success', Icon: SuccessSvg }
      case 'pending':
        if (type === 'safe') {
          return {
            text: 'Proceed to wallet to sign',
            color: 'primary',
            Icon: null,
          }
        }
        return { text: 'Pending...', color: 'primary', Icon: null }
      default:
      case 'empty':
        return { text: 'Not started', color: 'secondary', Icon: null }
    }
  }, [status, type])

  if (status === 'empty') {
    return (
      <Wrap $color={color} onClick={onClick}>
        {Icon && <Icon />}
        <Text as="span" size="xxs" weight={700}>
          {text}
        </Text>
      </Wrap>
    )
  }

  return (
    <>
      <Wrap $color={color} onClick={onClick}>
        {Icon && <Icon />}
        <Text as="span" size="xxs" weight={700}>
          {text}
        </Text>
      </Wrap>
      {status === 'success' && (
        <Tooltip
          placement="top"
          title={
            <span>View on {type === 'regular' ? 'Etherscan' : 'Safe'}</span>
          }
        >
          <ExplorerButton onClick={onClick} />
        </Tooltip>
      )}
    </>
  )
}
