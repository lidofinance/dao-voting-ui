import styled from 'styled-components'
import { Text as TextLocal } from 'modules/shared/ui/Common/Text'

export const Wrap = styled.a`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spaceMap.lg}px;
  height: 280px;
  word-break: break-all;
  background-color: var(--lido-color-foreground);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  box-shadow: 0px 4px 32px var(--lido-color-shadowLight);
  color: inherit;
  text-decoration: none;
`

export const Footer = styled.div`
  margin-top: auto;
  margin-bottom: 0;
`

export const DescriptionWrap = styled(TextLocal).attrs({
  size: 14,
  weight: 400,
})`
  margin-bottom: ${({ theme }) => theme.spaceMap.lg}px;
  line-height: 24px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;

  & b {
    font-weight: 700;
  }
`

export const VotesBarWrap = styled.div`
  margin-bottom: ${({ theme }) => theme.spaceMap.sm}px;
`
