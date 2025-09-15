import { ButtonIcon, Popover } from '@lidofinance/lido-ui'
import styled from 'styled-components'
import { getDualGovernanceBannerColor } from '../utils'
import { DualGovernanceStatus } from '../types'

export const DualGovernanceStatusButtonStyled = styled(ButtonIcon).attrs({
  color: 'secondary',
  size: 'sm',
  variant: 'ghost',
})<{ $status: DualGovernanceStatus; $loading?: boolean }>`
  border: 1px solid rgba(0, 10, 61, 0.12);
  margin-right: 12px;
  padding: 14px;

  & svg {
    fill: ${({ $status }) => getDualGovernanceBannerColor($status)};
  }
`

export const PopoverStyled = styled(Popover)`
  width: 280px;
  padding: 0 !important;
`
