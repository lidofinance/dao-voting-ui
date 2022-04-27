import { Text } from '@lidofinance/lido-ui'
import styled from 'styled-components'

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

export const ScriptFunctionWrapper = styled.pre`
  border-radius: ${props => props.theme.borderRadiusesMap.sm}px;
  background-color: rgb(242, 242, 244);
  padding: ${props => props.theme.spaceMap.sm}px;
  color: rgb(22, 22, 24);
  overflow-x: auto;
  code {
    font-family: 'Courier New', Courier, monospace !important;
  }
`

export const SciptFunctionType = styled.span`
  color: rgb(15, 14, 255);
`

export const CallWrapper = styled.div`
  margin: ${props => props.theme.spaceMap.md}px 0;
`

export const CallTitle = styled(Text)`
  margin-bottom: ${props => props.theme.spaceMap.sm}px;
`
