import styled from 'styled-components'

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

export const ScriptBox = styled.textarea.attrs({
  rows: 6,
  readOnly: true,
})`
  margin-top: 6px;
  margin-bottom: 40px;
  padding: 10px;
  display: block;
  resize: vertical;
  width: 100%;
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono,
    Courier New, monospace !important;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  /* border-radius: 0 8px 8px 8px; */
  background-color: rgba(255, 255, 255, 0.2);
  outline: none;
`
