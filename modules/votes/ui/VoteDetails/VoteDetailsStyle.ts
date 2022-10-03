import styled from 'styled-components'
import { Text as TextLocal } from 'modules/shared/ui/Common/Text'
import { DataTable as DataTableOriginal } from '@lidofinance/lido-ui'

export const VotesTitleWrap = styled.div`
  margin-bottom: 6px;
  display: flex;
  justify-content: space-between;
`

export const VotesBarWrap = styled.div`
  display: flex;
  margin-bottom: 16px;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.background};
`

const VotesBar = styled.div`
  height: 100%;
`

export const VotesBarNay = styled(VotesBar)`
  background-color: ${({ theme }) => theme.colors.error};
`

export const VotesBarYea = styled(VotesBar)`
  background-color: ${({ theme }) => theme.colors.primary};
`

export const TextNay = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.error};
`

export const TextYay = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
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

export const BoxRow = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 10px;

  & > ${Box} {
    flex: 1 1 auto;
  }
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
