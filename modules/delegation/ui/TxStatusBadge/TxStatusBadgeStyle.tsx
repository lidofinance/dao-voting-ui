import { ButtonIcon, External } from '@lidofinance/lido-ui'
import styled, { css } from 'styled-components'

export const Wrap = styled.button<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 6px;
  border-radius: 4px;
  outline: none;
  border: none;

  background-color: ${({ $color }) =>
    `rgba(var(--lido-rgb-${$color}), ${$color === 'success' ? '0.2' : '0.1'})`};

  span {
    color: ${({ $color }) =>
      $color === 'secondary'
        ? 'var(--lido-color-textSecondary)'
        : `var(--lido-color-${$color})`};
  }

  ${({ $color }) =>
    $color === 'success' &&
    css`
      svg {
        width: 12px;
        height: 12px;
        background-color: var(--lido-color-success);
        border-radius: 50%;

        path {
          fill: rgba(255, 255, 255, 0.8);
        }
      }
    `}

  ${({ $color }) =>
    $color === 'warning' &&
    css`
      svg {
        path {
          fill: var(--lido-color-warning);
        }
      }
    `}
`

export const ExplorerButton = styled(ButtonIcon).attrs({
  icon: <External />,
  variant: 'translucent',
  size: 'xs',
})`
  padding: 6px;
`
