import styled from 'styled-components'
import { Text as TextLocal } from 'modules/shared/ui/Common/Text'
import { DataTable as DataTableOriginal } from '@lidofinance/lido-ui'
import { ContentHighlightBox } from 'modules/shared/ui/Common/ContentHighlightBox'
import { AddressBadge } from 'modules/shared/ui/Common/AddressBadge'

export const BoxVotes = styled(ContentHighlightBox)`
  padding: ${({ theme }) => theme.spaceMap.lg}px;
`

export const VoteTitle = styled(TextLocal).attrs({
  size: 20,
  weight: 700,
})`
  margin-bottom: ${({ theme }) => theme.spaceMap.lg}px;
`

export const DetailsBoxWrap = styled.div`
  margin-bottom: ${({ theme }) => theme.spaceMap.lg}px;
`

export const DescriptionWrap = styled.div`
  color: var(--lido-color-text);
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  font-weight: 400;
  line-height: 24px;
`

export const DataTable = styled(DataTableOriginal)`
  margin-bottom: ${({ theme }) => theme.spaceMap.lg}px;
`

export const CreatorBadge = styled(AddressBadge)`
  margin-left: auto;
  margin-right: 0;
  display: flex;
`
