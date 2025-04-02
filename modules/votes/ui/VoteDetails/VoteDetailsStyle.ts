import styled from 'styled-components'

import { Text, DataTable as DataTableOriginal } from '@lidofinance/lido-ui'
import { ContentHighlightBox } from 'modules/shared/ui/Common/ContentHighlightBox'
import { AddressBadge } from 'modules/shared/ui/Common/AddressBadge'

export const BoxVotes = styled(ContentHighlightBox)`
  padding: 0;
  background: none;
`

export const VoteTitle = styled(Text).attrs({
  size: 'lg',
  weight: 700,
})`
  flex-shrink: 0;
`
export const ResultsHeadingWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const SectionHeading = styled(Text).attrs({
  size: 'sm',
  weight: 700,
})`
  margin: 20px 0;
`

export const DetailsBoxWrap = styled.div`
  margin-top: ${({ theme }) => theme.spaceMap.md}px;
  margin-bottom: ${({ theme }) => theme.spaceMap.xxl}px;
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

export const VoteHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: ${({ theme }) => theme.spaceMap.sm}px;
`

export const BlockWrap = styled.div`
  text-align: right;
`

export const VoteTimestamps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
