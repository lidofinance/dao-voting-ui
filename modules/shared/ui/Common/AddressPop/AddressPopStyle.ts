import styled, { css, keyframes } from 'styled-components'

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
    display: flex;
    justify-content: space-between;
  }
`
