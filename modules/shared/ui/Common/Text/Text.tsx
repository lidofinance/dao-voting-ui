import type { Theme } from '@lidofinance/lido-ui'
import styled, { css } from 'styled-components'

export type TextSize = 10 | 12 | 14 | 16 | 18 | 20 | 26 | 48
export type TextWeight = 400 | 500 | 700 | 800
export type TextColor = keyof Theme['colors'] | 'inherit'

type Props = {
  size: TextSize
  weight: TextWeight
  color?: TextColor
  truncateLines?: number
  isCentered?: boolean
}

export const Text = styled.div<Props>`
  font-size: ${({ size }) => size}px;
  font-weight: ${({ weight }) => weight};
  color: ${({ color = 'text' }) =>
    color === 'inherit' ? color : `var(--lido-color-${color})`};

  ${({ isCentered }) =>
    isCentered &&
    css`
      text-align: center;
    `}

  ${({ truncateLines }) =>
    truncateLines === undefined
      ? undefined
      : truncateLines === 1
      ? css`
          max-width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        `
      : css`
          display: -webkit-box;
          overflow: hidden;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: ${truncateLines};
        `}
`
