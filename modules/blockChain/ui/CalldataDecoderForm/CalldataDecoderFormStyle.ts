import { Block } from '@lidofinance/lido-ui'
import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
`

export const DecodedData = styled(Block)`
  padding: 18px;
  border-radius: 10px;
  p {
    font-family: SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono,
      Courier New, monospace !important;
  }
`

export const KeyValue = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  transition: background-color 0.2s;
  padding: 2px;
  border-radius: 2px;
  &:hover {
    background-color: rgba(var(--lido-rgb-primaryHover), 0.1);
  }
`

export const BlockHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8x;
  margin-bottom: ${({ theme }) => theme.spaceMap.md}px;
`

export const NestedBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 4px;
  border-left: 1px solid var(--lido-color-accentBorder);
  transition: border-color 0.2s;

  &:hover {
    border-color: var(--lido-color-primary);
  }
`

export const TextBlockStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: var(--lido-color-foreground);
  border-radius: 10px;
  padding: 18px;
  gap: 16px;
`
