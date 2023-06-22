import styled, { css, keyframes } from 'styled-components'
import { Container, Text } from '@lidofinance/lido-ui'
import { BREAKPOINT_MOBILE } from 'modules/globalStyles'

export const Wrap = styled(Container).attrs({
  as: 'header',
  size: 'full',
})`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  padding: 0 ${({ theme }) => theme.spaceMap.lg}px;
  display: flex;
  height: 76px;
  align-items: center;
  justify-content: space-between;
  background-color: var(--lido-color-foreground);
  border-bottom: 1px solid var(--lido-color-border);
  z-index: 99;
`

export const Nav = styled.div`
  display: flex;
  align-items: center;
  width: 30%;
`

export const Logo = styled.div`
  margin-right: ${({ theme }) => theme.spaceMap.lg}px;
  font-size: 0;
  z-index: 99;
`

export const NavItems = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    display: none;
  }
`

type NavLinkProps = {
  isActive: boolean
}
export const NavLink = styled.a<NavLinkProps>`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  font-weight: 800;
  text-decoration: none;
  text-transform: uppercase;
  color: var(--lido-color-text);
  transition: color ease ${({ theme }) => theme.duration.norm};

  &:hover {
    transition-duration: ${({ theme }) => theme.duration.fast};
  }

  &:not(:last-child) {
    margin-right: ${({ theme }) => theme.spaceMap.lg}px;
  }

  & svg {
    display: block;
    fill: currentColor;
  }

  ${({ isActive }) =>
    isActive &&
    css`
      color: var(--lido-color-primary);
    `}

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    text-transform: none;
    font-weight: 700;
    font-size: ${({ theme }) => theme.fontSizesMap.xs}px;

    &:not(:last-child) {
      margin-right: 0;
      margin-bottom: ${({ theme }) => theme.spaceMap.xxl}px;
    }
  }
`

export const NavLinkIconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: ${({ theme }) => theme.spaceMap.sm}px;
`

export const NavLinkInner = styled.div`
  display: flex;
  align-items: center;
`

export const ActionsDesktop = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 30%;

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    display: none;
  }
`

export const InputWrap = styled.div`
  width: 300px;

  @media (max-width: 900px) {
    width: 220px;
  }

  @media (max-width: 810px) {
    width: 200px;
  }
`

export const Network = styled.div`
  margin-right: ${({ theme }) => theme.spaceMap.sm}px;
  display: flex;
  align-items: center;
`

type NetworkBulbProps = { color: string }
export const NetworkBulb = styled.div<NetworkBulbProps>`
  position: relative;
  top: 1px;
  margin-right: ${({ theme }) => theme.spaceMap.xs}px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
`

export const ThemeTogglerWrap = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: ${({ theme }) => theme.spaceMap.sm}px;
  width: 44px;
  height: 44px;
  border: 1px solid var(--lido-color-border);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.sm}px;
  overflow: hidden;

  & > * {
    margin: 0;
  }
`

export const BurgerLine = styled.div`
  width: 25px;
  height: 2px;
  background-color: var(--lido-color-text);
  transition: transform ease ${({ theme }) => theme.duration.norm},
    opacity ease ${({ theme }) => theme.duration.norm};

  &:not(:last-child) {
    margin-bottom: 6px;
  }

  &:nth-child(1) {
    transform-origin: right -1px;
  }

  &:nth-child(3) {
    transform-origin: right 3px;
  }
`

export const NavBurger = styled.div`
  display: none;
  justify-content: flex-end;
  position: relative;
  z-index: 99;
  width: 30%;

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    display: flex;
  }
`

type BurgerWrapProps = { isOpened: boolean }
export const BurgerWrap = styled.div<BurgerWrapProps>`
  margin: -10px;
  padding: 10px;

  ${({ isOpened }) =>
    isOpened &&
    css`
      ${BurgerLine}:nth-child(1) {
        transform: rotate(-45deg);
      }
      ${BurgerLine}:nth-child(2) {
        opacity: 0;
      }
      ${BurgerLine}:nth-child(3) {
        transform: rotate(45deg);
      }
    `}
`

const menuAppearing = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

export const MobileMenu = styled.div`
  display: flex;
  flex-direction: column;
  padding: 90px ${({ theme }) => theme.spaceMap.lg}px 0;
  position: fixed;
  overflow: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(12px);
  z-index: 98;
  animation: ${menuAppearing} ${({ theme }) => theme.duration.norm} ease 0s 1;
`

export const MobileMenuScroll = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`

export const MobileNavItems = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spaceMap.xxl}px;
`

export const MobileNetworkLabel = styled(Text).attrs({
  color: 'secondary',
  size: 'xs',
})``

export const MobileNetworkWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: ${({ theme }) => theme.spaceMap.xxl}px;
  margin-bottom: ${({ theme }) => theme.spaceMap.md}px;

  & ${ThemeTogglerWrap} {
    margin-left: 0;
    margin-right: ${({ theme }) => theme.spaceMap.sm}px;
  }

  & ${Network} {
    margin-right: 0;
    margin-left: ${({ theme }) => theme.spaceMap.sm}px;
  }

  & ${NetworkBulb} {
    margin-right: ${({ theme }) => theme.spaceMap.sm}px;
  }
`

export const MobileSpacer = styled.div`
  height: 90px;
  display: none;

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    display: block;
  }
`

export const HeaderSpacer = styled.div`
  height: 76px;
  margin-bottom: 30px;
`
