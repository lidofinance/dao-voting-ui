import styled from 'styled-components'
import { VotePhasesTooltip } from '../VotePhasesTooltip'
import { Button } from '@lidofinance/lido-ui'

export const Actions = styled.div`
  margin-bottom: ${({ theme }) => theme.spaceMap.lg}px;
  display: flex;
  gap: 10px;

  @media (max-width: 375px) {
    flex-direction: column;
  }

  > * {
    flex: 1 1 50%;

    @media (max-width: 375px) {
      flex-basis: auto;
    }
  }
`

export const TxStatusWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding-bottom: ${({ theme }) => theme.spaceMap.sm}px;
`

export const PhasesTooltip = styled(VotePhasesTooltip)`
  display: flex;

  > * {
    flex: 1 1 auto;
  }
`

type ButtonProps = {
  ref: React.RefObject<HTMLButtonElement>
}

export const VoteButtonStyled = styled(Button).attrs<ButtonProps>({
  ref: (props: ButtonProps) => props.ref,
})`
  width: 100%;
  padding: 0 16px;
  text-align: start;
  height: 56px;

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
