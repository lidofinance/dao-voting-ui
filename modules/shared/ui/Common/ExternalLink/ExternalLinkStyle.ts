import styled from 'styled-components'

export const ExternalLinkWrap = styled.span`
  display: inline;
  height: ${({ theme }) => theme.spaceMap.lg}px;
  width: fit-content;
  color: var(--lido-color-primary);
  cursor: pointer;
`
