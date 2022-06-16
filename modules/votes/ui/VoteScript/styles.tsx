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

export const CallWrapper = styled.div`
  margin: ${props => props.theme.spaceMap.md}px 0;
`

export const CallTitle = styled(Text)`
  margin-bottom: ${props => props.theme.spaceMap.sm}px;
`

export const Padding = styled.div`
  padding-left: 20px;
  border-left: 2px solid ${p => p.theme.colors.borderLight};
`
