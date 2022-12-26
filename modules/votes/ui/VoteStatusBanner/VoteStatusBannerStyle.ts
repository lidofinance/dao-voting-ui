import styled from 'styled-components'
import { VoteStatusFontSize, StyledStatusVariant } from './types'

type BannerTextProps = { variant: StyledStatusVariant }
export const BannerText = styled.div<BannerTextProps>`
  color: ${({ theme, variant }) =>
    variant === StyledStatusVariant.Active
      ? theme.colors.primary
      : theme.colors.textSecondary};
`

type InfoTextProps = { variant: StyledStatusVariant }
export const InfoText = styled.div<InfoTextProps>`
  margin-right: 0;
  margin-left: auto;
  color: ${({ theme, variant }) =>
    variant === StyledStatusVariant.Active
      ? theme.colors.primary
      : theme.colors.textSecondary};
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
    fill: ${({ theme }) => theme.colors.success};
  }
`

export const BadgeFailed = styled(Badge)`
  & svg {
    width: 16px;
    height: 16px;
    fill: ${({ theme }) => theme.colors.error};
  }
`

export const BadgeOngoing = styled(Badge)`
  color: #fff;
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  font-weight: 700;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.primary};
`

type WrapProps = { variant: StyledStatusVariant; fontSize: VoteStatusFontSize }
export const Wrap = styled.div<WrapProps>`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spaceMap.lg}px;
  padding: 10px;
  font-weight: 400;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  font-size: ${({ fontSize, theme }) => theme.fontSizesMap[fontSize]}px;
  background-color: ${({ variant, theme }) =>
    variant === StyledStatusVariant.Active
      ? 'rgba(0, 163, 255, 0.1)'
      : theme.colors.backgroundSecondary};
`
