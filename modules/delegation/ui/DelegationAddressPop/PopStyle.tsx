import styled, { css, keyframes } from 'styled-components'
import { IdenticonBadge } from '@lidofinance/lido-ui'

export const Wrap = styled.span`
  position: relative;
  cursor: pointer;
`

const popIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`

type PopProps = { isVisible: boolean }
type IdenticonBadgeProps = React.ComponentProps<typeof IdenticonBadge>

export const Pop = styled.div<PopProps>`
  cursor: default;
  padding: ${({ theme }) => theme.spaceMap.sm}px;
  position: fixed;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  background-color: var(--lido-color-foreground);
  box-shadow: ${({ theme }) => theme.boxShadows.sm}
    var(--lido-color-shadowLight);
  z-index: 999;

  ${({ isVisible }) =>
    isVisible
      ? css`
          animation: ${popIn} ${({ theme }) => theme.duration.norm} 1;
          animation-timing-function: ${({ theme }) => theme.ease.outBack};
        `
      : css`
          opacity: 0;
          pointer-events: none;
        `}
`

export const BadgeWrap = styled.div`
  margin-bottom: 10px;

  & > div {
    font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
    font-weight: 500;
    background-color: rgba(0, 0, 0, 0.05);
  }
`

export const DelegateWrap = styled.div``

export const VotedBy = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  margin-top: 24px;
  padding-left: 16px;
`

export const IdenticonBadgeWrap = styled(IdenticonBadge)<IdenticonBadgeProps>`
  margin: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const PublicDelegateWrap = styled.div`
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;

  & > span {
    padding: 0px 6px;
    flex: 1;
  }
`
