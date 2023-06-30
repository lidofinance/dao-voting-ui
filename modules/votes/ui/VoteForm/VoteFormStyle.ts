import styled from 'styled-components'
import { Text } from '@lidofinance/lido-ui'

export const Desc = styled.div`
  padding: ${({ theme }) => theme.spaceMap.lg}px 0;
  text-align: center;

  & > p:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.spaceMap.sm}px;
  }
`

export const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spaceMap.lg}px;
  color: #fff;
  background-color: var(--lido-color-error);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;

  & a {
    color: #fff;
  }
`

export const ClearButton = styled(Text).attrs({
  size: 'xs',
  weight: 700,
  color: 'primary',
})`
  cursor: pointer;
`
