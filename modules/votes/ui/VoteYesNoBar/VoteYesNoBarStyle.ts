import styled, { css } from 'styled-components'

export const VotesTitleWrap = styled.div`
  margin-bottom: ${({ theme }) => theme.spaceMap.sm}px;
  display: flex;
  justify-content: space-between;
`

type VotesBarWrapProps = { showOnForeground?: boolean }
export const VotesBarWrap = styled.div<VotesBarWrapProps>`
  display: flex;
  height: 6px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.sm}px;
  overflow: hidden;
  ${({ showOnForeground }) =>
    showOnForeground
      ? css`
          background-color: ${({ theme }) => theme.colors.background};
        `
      : css`
          border: 1px solid ${({ theme }) => theme.colors.foreground};
          background-color: ${({ theme }) => theme.colors.foreground};
        `}
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
