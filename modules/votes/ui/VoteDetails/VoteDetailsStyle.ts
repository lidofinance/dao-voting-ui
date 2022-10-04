import styled from 'styled-components'
import { Text as TextLocal } from 'modules/shared/ui/Common/Text'
import { DataTable as DataTableOriginal } from '@lidofinance/lido-ui'

export const VotesTitleWrap = styled.div`
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;

  & * {
    line-height: 1;
  }
`

export const VotesBarWrap = styled.div`
  display: flex;
  height: 6px;
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.foreground};
  background-color: ${({ theme }) => theme.colors.foreground};
`

const VotesBar = styled.div`
  height: 100%;
  overflow: hidden;
`

export const VotesBarNay = styled(VotesBar)`
  background-color: #e14d4d;
`

export const VotesBarYea = styled(VotesBar)`
  background-color: #53ba95;
`

type BoxProps = { isCentered?: boolean }
export const Box = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
  font-weight: 400;
  border-radius: 10px;
  text-align: ${({ isCentered }: BoxProps) => (isCentered ? 'center' : 'left')};
  background-color: ${({ theme }) => theme.colors.background};
`

export const BoxVotes = styled(Box)`
  padding: 20px;
`

export const VoteTitle = styled(TextLocal).attrs({
  size: 20,
  weight: 700,
})`
  margin-bottom: 20px;
`

export const CreatedBy = styled.div`
  margin-bottom: 20px;
`

export const CreatorBadge = styled.div`
  margin-left: auto;
  margin-right: 0;
  padding: 0 8px 0 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  width: fit-content;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.background};

  & > div:nth-child(1) {
    margin-right: 4px;
  }
`

export const DataTable = styled(DataTableOriginal)`
  margin-bottom: 20px;
`

export const InfoRow = styled.div`
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
`

export const InfoLabel = styled.div`
  display: flex;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const InfoValue = styled.div`
  display: flex;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text};
`
