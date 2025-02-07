import { ButtonIcon, Popover } from '@lidofinance/lido-ui'
import styled from 'styled-components'
import { DGIcon } from './DGIcon'
import { getBulbColor } from '../../utils'
import { DualGovernanceStatus } from '../../types'

export const DualGovernanceStatusButtonStyled = styled(ButtonIcon).attrs({
  icon: DGIcon,
  color: 'secondary',
  size: 'sm',
  variant: 'ghost',
})<{ $status: DualGovernanceStatus }>`
  border: 1px solid rgba(0, 10, 61, 0.12);
  margin-right: 12px;
  // border-radius: 10px;

  & svg {
    fill: ${({ $status }) => getBulbColor($status)};
  }
`

export const PopoverStyled = styled(Popover)`
  width: 280px;
  padding: 0 !important;
`
