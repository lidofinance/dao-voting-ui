import { Button } from '@lidofinance/lido-ui'
import styled from 'styled-components'

export const Wrap = styled(Button).attrs({
  fullwidth: true,
  variant: 'ghost',
})`
  margin-bottom: ${({ theme }) => theme.spaceMap.sm}px;
  padding-left: ${({ theme }) => theme.spaceMap.lg}px;
  padding-right: ${({ theme }) => theme.spaceMap.lg}px;
  padding-top: 0;
  padding-bottom: 0;
  display: flex;
  height: 56px;
  text-align: left;
  font-weight: 400;
  font-size: ${({ theme }) => theme.fontSizesMap.sm}px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};

  > span {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
  }
`

export const Icon = styled.span`
  flex: 0 0 auto;
  display: flex;
  font-size: 0;

  svg {
    width: 40px;
  }
`
