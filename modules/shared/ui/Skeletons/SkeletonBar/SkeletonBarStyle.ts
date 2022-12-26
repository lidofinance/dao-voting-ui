import styled, { keyframes } from 'styled-components'

const barPulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
`

type BarProps = { showOnBackground?: boolean }
export const Bar = styled.div<BarProps>`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 2px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xs}px;
  background-color: ${({ theme, showOnBackground }) =>
    showOnBackground
      ? theme.colors.foreground
      : theme.colors.backgroundSecondary};
  animation: ${barPulse} 1s ease 0s infinite;
`
