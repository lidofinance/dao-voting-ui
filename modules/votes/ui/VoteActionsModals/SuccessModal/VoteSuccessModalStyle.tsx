import styled from 'styled-components'
import { Button } from '@lidofinance/lido-ui'

export const LinkWrap = styled.div`
  margin-bottom: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`

export const ExtraVotingWrap = styled.div`
  margin-top: 16px;
  padding: 16px;
  border-radius: 20px;
  background-color: var(--lido-color-backgroundSecondary);
`

export const DelegateCtaWrap = styled.div`
  ul {
    margin-top: 16px;
    text-align: left;
    color: var(--lido-color-textSecondary);
    font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  }

  button {
    width: 100%;
    margin-top: 16px;
  }
`

export const InlineButtonGroup = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`

export const VoteButtonStyled = styled(Button)`
  width: 100%;

  button {
    text-align: center;
  }

  & > span {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  svg {
    display: block;
    margin-right: ${({ theme }) => theme.spaceMap.sm}px;
    width: 24px;
    height: 24px;
    fill: currentColor;
  }
`

export const TxStatusWrapper = styled.div`
  margin-top: 8px;
`

export const LoaderWrap = styled.div`
  display: flex;
  justify-content: center;
`
