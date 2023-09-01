import styled from 'styled-components'
import { Text } from '@lidofinance/lido-ui'

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

export const VoteBody = styled.div`
  margin-bottom: ${({ theme }) => theme.spaceMap.lg}px;
`

export const VoteTitle = styled(Text).attrs({
  size: 'xs',
  weight: 700,
})``

export const VoteDescriptionWrap = styled(Text).attrs({
  size: 'xxs',
  weight: 400,
})`
  margin-top: ${({ theme }) => theme.spaceMap.sm}px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
`

export const VotesBarWrap = styled.div`
  margin-bottom: ${({ theme }) => theme.spaceMap.sm}px;
`

export const Footer = styled.div`
  margin-top: auto;
  margin-bottom: 0;
`
