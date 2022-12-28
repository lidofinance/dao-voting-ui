import styled, { css } from 'styled-components'
import { VotePhasesTooltip } from '../VotePhasesTooltip'
import { Button } from '@lidofinance/lido-ui'

export const Actions = styled.div`
  margin-bottom: ${({ theme }) => theme.spaceMap.lg}px;
  display: flex;
  gap: 10px;

  > * {
    flex: 1 1 50%;
  }
`

export const PhasesTooltip = styled(VotePhasesTooltip)`
  display: flex;

  > * {
    flex: 1 1 auto;
  }
`

type ButtonVoteProps = {
  color: 'success' | 'error' | 'primary' | 'secondary'
}
export const ButtonVote = styled(Button)`
  padding: 0 16px;
  text-align: start;
  height: 56px;

  ${({ color }: ButtonVoteProps) => {
    if (color === 'success') {
      return css`
        background-color: var(--lido-color-success);
      `
    }
  }}

  & > span {
    display: flex;
    align-items: center;
  }

  svg {
    display: block;
    margin-right: ${({ theme }) => theme.spaceMap.sm}px;
    width: 24px;
    height: 24px;
    fill: currentColor;
  }
`
