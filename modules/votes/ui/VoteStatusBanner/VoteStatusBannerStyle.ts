import styled from 'styled-components'
import { VoteStatusFontSize, StyledStatusVariant } from './types'

type BannerTextProps = { variant: StyledStatusVariant }
export const BannerText = styled.div<BannerTextProps>`
  color: ${({ variant }) =>
    variant === StyledStatusVariant.Active
      ? 'var(--lido-color-primary)'
      : 'var(--lido-color-textSecondary)'};
`

type InfoTextProps = { variant: StyledStatusVariant }
export const InfoText = styled.div<InfoTextProps>`
  margin-right: 0;
  margin-left: auto;
  color: ${({ variant }) =>
    variant === StyledStatusVariant.Active
      ? 'var(--lido-color-primary)'
      : 'var(--lido-color-textSecondary)'};
`

const Badge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }) => theme.spaceMap.sm}px;
  width: ${({ theme }) => theme.spaceMap.lg}px;
  height: ${({ theme }) => theme.spaceMap.lg}px;

  & svg {
    display: block;
  }
`

export const BadgePassed = styled(Badge)`
  & svg {
    width: 16px;
    height: 16px;
    fill: var(--lido-color-success);
  }
`

export const BadgeFailed = styled(Badge)`
  & svg {
    width: 16px;
    height: 16px;
    fill: var(--lido-color-error);
  }
`

export const BadgeNoQuorum = styled(Badge)`
  & svg {
    width: 16px;
    height: 16px;
    fill: var(--lido-color-warning);
  }
`

export const BadgeOngoing = styled(Badge)`
  color: #fff;
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  font-weight: 700;
  border-radius: 5px;
  background-color: var(--lido-color-primary);
`

type WrapProps = { variant: StyledStatusVariant; fontSize: VoteStatusFontSize }
export const Wrap = styled.div<WrapProps>`
  margin-top: 14px;
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spaceMap.lg}px;
  padding: 10px;
  font-weight: 400;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  font-size: ${({ fontSize, theme }) => theme.fontSizesMap[fontSize]}px;
  background-color: ${({ variant }) =>
    variant === StyledStatusVariant.Active
      ? 'rgba(0, 163, 255, 0.1)'
      : 'var(--lido-color-backgroundSecondary)'};
`
