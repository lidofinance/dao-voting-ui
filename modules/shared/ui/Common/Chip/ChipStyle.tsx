import styled, { css } from 'styled-components'
import { ChipVariant } from './types'

type InjectedPropsTr = {
  $variant: ChipVariant
}

const ChipStatusStyle = {
  success: css`
    background: #53ba951a;
    color: #53ba95;
  `,
  warning: css`
    background: #ec86001a;
    color: #ec8600;
  `,
  danger: css`
    background: #e14d4d1a;
    color: #e14d4d;
  `,
  default: css`
    background: #7a8aa01a;
    color: var(--lido-color-textSecondary); ;
  `,
}

export const ChipWrap = styled.div<InjectedPropsTr>`
  ${({ $variant }) => ChipStatusStyle[$variant]};
  padding: 0 4px;
  border-radius: 5px;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
`
