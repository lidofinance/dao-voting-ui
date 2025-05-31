import styled, { css } from 'styled-components'

const containerStyles = {
  primary: css`
    background-color: rgba(0, 163, 255, 0.2);
  `,
  secondary: css`
    background-color: rgba(122, 138, 160, 0.2);
  `,
  default: css`
    background-color: rgba(122, 138, 160, 1);
  `,
}

const fillerStyles = {
  active: css`
    background-color: var(--lido-color-primary);
  `,
  default: css`
    background-color: rgba(122, 138, 160, 1);
  `,
}

type ProgressBarContainerProps = {
  $backgroundType: 'primary' | 'secondary' | 'default'
}

export const ProgressBarContainer = styled.div<ProgressBarContainerProps>`
  height: 4px;
  width: 100%;
  border-radius: 2px;
  ${({ $backgroundType }) => containerStyles[$backgroundType]};
`

type ProgressBarFillerProps = {
  $fillerType: 'active' | 'default'
  $progress: number
}

export const ProgressBarFiller = styled.div.attrs<ProgressBarFillerProps>(
  props => ({
    style: {
      width: `${Math.min(props.$progress, 100)}%`,
    },
  }),
)<ProgressBarFillerProps>`
  height: 100%;
  border-radius: 2px;
  ${({ $fillerType }) => fillerStyles[$fillerType]};
`
