import styled, { css } from 'styled-components'
import { VoteStatus } from 'modules/votes/types'

export const VotesTitleWrap = styled.div`
  margin-top: 16px;
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

type StatusTextProps = { status?: VoteStatus }
export const StatusText = styled.div`
  font-weight: 600;
  ${({ status }: StatusTextProps) => css`
    color: ${({ theme }) =>
      status === VoteStatus.Rejected
        ? theme.colors.error
        : status === VoteStatus.Executed
        ? theme.colors.success
        : theme.colors.primary};
  `}
`

export const TextNay = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.error};
`

export const TextYay = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`
