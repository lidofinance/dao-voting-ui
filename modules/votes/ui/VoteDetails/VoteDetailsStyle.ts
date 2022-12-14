import styled from 'styled-components'
import { Text as TextLocal } from 'modules/shared/ui/Common/Text'
import { DataTable as DataTableOriginal } from '@lidofinance/lido-ui'
import { ContentHighlightBox } from 'modules/shared/ui/Common/ContentHighlightBox'

export const BoxVotes = styled(ContentHighlightBox)`
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
