import { Button } from '@lidofinance/lido-ui'
import styled from 'styled-components'

export const Content = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  padding: ${({ theme }) => theme.spaceMap.lg}px;
`

export const Connected = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`

export const Connector = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: 1.4em;
  flex-grow: 1;
  padding-right: ${({ theme }) => theme.spaceMap.md}px;
  margin-right: auto;
`

export const Disconnect = styled(Button)`
  flex-shrink: 0;
`

export const Row = styled.div`
  display: flex;
  align-items: center;

  &:not(:last-child) {
    margin-bottom: 15px;
  }
`

export const Address = styled.div`
  margin-left: ${({ theme }) => theme.spaceMap.sm}px;
  font-size: ${({ theme }) => theme.fontSizesMap.lg}px;
  line-height: 1.2em;
  font-weight: 600;
`
