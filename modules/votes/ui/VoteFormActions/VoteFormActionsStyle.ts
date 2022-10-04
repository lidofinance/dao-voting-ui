import styled, { css } from 'styled-components'
import { VotePhasesTooltip } from '../VotePhasesTooltip'
import { Button } from '@lidofinance/lido-ui'

export const Actions = styled.div`
  margin-bottom: 20px;
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
        background-color: #53ba95;
      `
    }
  }}

  & > span {
    display: flex;
    align-items: center;
  }

  svg {
    display: block;
    margin-right: 8px;
    width: 24px;
    height: 24px;
    fill: currentColor;
  }
`
