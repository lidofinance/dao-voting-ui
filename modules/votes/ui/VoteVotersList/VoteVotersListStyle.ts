import styled from 'styled-components'
import { Identicon as IdenticonOriginal } from '@lidofinance/lido-ui'

export const Wrap = styled.div`
  margin-top: ${({ theme }) => theme.spaceMap.lg}px;
`

export const TitleWrap = styled.div`
  display: flex;
  margin-bottom: 10px;
`

export const ListRow = styled.div`
  padding: 0 ${({ theme }) => theme.spaceMap.lg}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:not(:last-child) {
    border-bottom: none;
  }

  &:first-child {
    border-top-left-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
    border-top-right-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  }

  &:last-child {
    border-bottom-left-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
    border-bottom-right-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  }
`

export const ListRowCell = styled.div`
  display: flex;
  align-items: center;

  &:nth-child(1) {
    flex: 2;
  }

  &:nth-child(2) {
    flex: 1;
    justify-content: center;
  }

  &:nth-child(3) {
    flex: 2;
    justify-content: flex-end;
  }
`

export const AddressWrap = styled.div`
  display: flex;
  align-items: center;
`

export const Identicon = styled(IdenticonOriginal)`
  flex: 0 0 auto;
  margin-right: ${({ theme }) => theme.spaceMap.sm}px;
`

export const CounterBadge = styled.div`
  margin-left: ${({ theme }) => theme.spaceMap.sm}px;
  padding: 0 ${({ theme }) => theme.spaceMap.sm}px;
  width: fit-content;
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
`

export const ShowMoreBtn = styled(ListRow)`
  justify-content: center;
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`
