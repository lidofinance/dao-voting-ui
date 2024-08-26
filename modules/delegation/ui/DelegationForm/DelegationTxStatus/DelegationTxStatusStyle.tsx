import { ButtonIcon } from '@lidofinance/lido-ui'
import styled from 'styled-components'

import Retry from 'assets/retry.com.svg.react'

export const Wrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  position: relative;

  &:nth-child(2):before {
    content: '';
    position: absolute;
    display: block;
    width: 1px;
    height: 14px;
    left: 11px;
    top: -13px;
    background-color: var(--lido-color-border);
  }
`

export const LabelWithIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    box-sizing: content-box;
    border: 1px solid var(--lido-color-border);
    border-radius: 50%;
  }
`

export const StatusWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const RetryButton = styled(ButtonIcon).attrs({
  icon: <Retry />,
  color: 'primary',
  variant: 'text',
  size: 'xxs',
})`
  padding: 8px;
`
