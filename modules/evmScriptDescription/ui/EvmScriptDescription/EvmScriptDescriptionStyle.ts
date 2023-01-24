import styled from 'styled-components'

export const DescriptionWrap = styled.div`
  hyphens: auto;
  overflow-wrap: anywhere;
  word-break: break-word;
  white-space: pre-wrap;
`

type DescriptionItemsListProps = {
  indentLevel?: number
}
export const DescriptionItemsList = styled.div<DescriptionItemsListProps>`
  padding-left: ${({ indentLevel, theme }) =>
    theme.spaceMap.md * (indentLevel || 0)}px;
`
