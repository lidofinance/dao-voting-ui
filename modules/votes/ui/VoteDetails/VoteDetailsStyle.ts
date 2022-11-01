import styled from 'styled-components'
import { Text as TextLocal } from 'modules/shared/ui/Common/Text'
import { DataTable as DataTableOriginal } from '@lidofinance/lido-ui'

export const VotesTitleWrap = styled.div`
  margin-bottom: ${({ theme }) => theme.spaceMap.sm}px;
  display: flex;
  justify-content: space-between;
`

export const VotesBarWrap = styled.div`
  display: flex;
  height: 6px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.sm}px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.foreground};
  background-color: ${({ theme }) => theme.colors.foreground};
`

const VotesBar = styled.div`
  height: 100%;
  overflow: hidden;
`

export const VotesBarNay = styled(VotesBar)`
  background-color: ${({ theme }) => theme.colors.error};
`

export const VotesBarYea = styled(VotesBar)`
  background-color: ${({ theme }) => theme.colors.success};
`

type BoxProps = { isCentered?: boolean }
export const Box = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizesMap.xxs};
  font-weight: 400;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  text-align: ${({ isCentered }: BoxProps) => (isCentered ? 'center' : 'left')};
  background-color: ${({ theme }) => theme.colors.background};
`

export const BoxVotes = styled(Box)`
  padding: ${({ theme }) => theme.spaceMap.lg}px;
`

export const VoteTitle = styled(TextLocal).attrs({
  size: 20,
  weight: 700,
})`
  margin-bottom: ${({ theme }) => theme.spaceMap.lg}px;
`

export const CreatedBy = styled.div`
  margin-bottom: ${({ theme }) => theme.spaceMap.lg}px;
`

export const CreatorBadge = styled.div`
  margin-left: auto;
  margin-right: 0;
  padding: 0 8px 0 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${({ theme }) => theme.spaceMap.lg}px;
  width: fit-content;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  background-color: ${({ theme }) => theme.colors.background};

  & > div:nth-child(1) {
    margin-right: 4px;
  }
`

export const DataTable = styled(DataTableOriginal)`
  margin-bottom: ${({ theme }) => theme.spaceMap.lg}px;
`

export const InfoRow = styled.div`
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
`

export const InfoLabel = styled.div`
  display: flex;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const InfoValue = styled.div`
  display: flex;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text};
`
