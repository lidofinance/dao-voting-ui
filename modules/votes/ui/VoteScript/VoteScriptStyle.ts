import styled, { css } from 'styled-components'
import { Text } from '@lidofinance/lido-ui'

export const Tabs = styled.div`
  position: relative;
  display: flex;
`

type TabProps = { isActive?: boolean }
export const Tab = styled.div`
  position: relative;
  padding: ${({ theme }) => theme.spaceMap.sm}px
    ${({ theme }) => theme.spaceMap.lg}px;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: none;
  cursor: pointer;
  z-index: 1;

  &:not(:first-child) {
    border-left: none;
  }

  &:first-child {
    border-radius: 10px 0 0 0;
  }

  &:last-child {
    border-radius: 0 10px 0 0;
  }

  &:last-child:first-child {
    border-radius: 10px 10px 0 0;
  }

  ${({ isActive }: TabProps) =>
    isActive &&
    css`
      border-bottom: none;
      color: ${({ theme }) => theme.colors.textSecondary};
      background-color: ${({ theme }) => theme.colors.background};
    `}
`

export const VoteScriptBodyWrap = styled.div`
  position: relative;
  margin-top: -1px;
  margin-bottom: ${({ theme }) => theme.spaceMap.lg}px;
  border-radius: 0 ${({ theme }) => theme.borderRadiusesMap.lg}px
    ${({ theme }) => theme.borderRadiusesMap.lg}px
    ${({ theme }) => theme.borderRadiusesMap.lg}px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
`

export const CallWrapper = styled.div`
  padding: ${({ theme }) => theme.spaceMap.lg}px;

  &:not(:last-child) {
    border-bottom: 1px solid ${p => p.theme.colors.border};
  }
`

export const CallTitle = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spaceMap.sm}px;
  font-weight: 600;
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono,
    Courier New, monospace !important;
`

export const NestedPadding = styled.div`
  margin-top: 10px;
  border-left: 2px solid ${p => p.theme.colors.borderLight};

  & > ${CallWrapper} {
    padding-top: 0;
    padding-bottom: 0;
  }
`

export const ScriptBox = styled.div`
  display: block;
  resize: vertical;
  width: 100%;
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono,
    Courier New, monospace !important;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  color: ${({ theme }) => theme.colors.text};
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.2);
  word-break: break-all;
  white-space: pre-wrap;
`

export const ScriptLoaderWrap = styled.div`
  &,
  &:after {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  &:after {
    content: '';
    display: block;
    opacity: 0.6;
    background-color: ${({ theme }) => theme.colors.foreground};
  }

  & > * {
    position: absolute;
    top: 50%;
    right: 50%;
  }
`
