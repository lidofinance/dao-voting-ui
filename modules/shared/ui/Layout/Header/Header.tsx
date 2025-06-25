import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/dist/client/router'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useScrollLock } from 'modules/shared/hooks/useScrollLock'
import Link from 'next/link'
import { NoSSRWrapper } from 'modules/shared/ui/Utils/NoSSRWrapper'
import { HeaderWallet } from '../HeaderWallet'
import {
  ThemeName,
  ThemeToggler,
  Dark,
  Light,
  useThemeToggle,
  Text,
  LidoLogo,
} from '@lidofinance/lido-ui'
import { HeaderVoteInput } from 'modules/votes/ui/HeaderVoteInput'
import {
  Wrap,
  Logo,
  Nav,
  NavItems,
  NavLink,
  NavLinkInner,
  NavLinkIconWrap,
  InputWrap,
  ActionsDesktop,
  Network,
  NetworkBulb,
  BurgerWrap,
  BurgerLine,
  MobileMenu,
  MobileMenuScroll,
  MobileNavItems,
  MobileNetworkWrap,
  MobileSpacer,
  NavBurger,
  ThemeTogglerWrap,
  MobileNetworkLabel,
  MobileDGWidgetWrap,
} from './HeaderStyle'

import { getChainName } from 'modules/blockChain/chains'
import { getChainColor } from '@lido-sdk/constants'
import StarSvg from 'assets/star.com.svg.react'
import SettingsSvg from 'assets/settings.com.svg.react'
import DelegationSvg from 'assets/delegation.com.svg.react'
import * as urls from 'modules/network/utils/urls'
import { DualGovernanceStatusButton } from 'modules/dual-governance/DualGovernanceStatusButton'
import { DualGovernanceWarningBanner } from 'modules/blockChain/ui/DualGovernanceWarningBanner'
import { useDualGovernanceState } from 'modules/dual-governance/useDualGovernanceState'
import { DualGovernanceStatus } from 'modules/dual-governance/types'
import { getUseModal } from 'modules/modal/useModal'
import { DualGovernanceWarningModal } from 'modules/dual-governance/DualGovernanceWarningModal/DualGovernanceWarningModal'

function NavItem({
  link,
  activeOn,
  onClick,
  children,
  ...rest
}: {
  link: string
  activeOn?: (string | { url: string; exact: boolean })[]
  onClick?: React.MouseEventHandler<HTMLElement>
  children: React.ReactNode
}) {
  const { asPath } = useRouter()

  const isActive = activeOn
    ? activeOn.some(v => {
        if (typeof v === 'object' && v.exact) {
          return asPath === v.url
        }
        const testUrl = typeof v === 'object' ? v.url : v
        return asPath.startsWith(testUrl)
      })
    : asPath.startsWith(link)

  return (
    <Link passHref href={link}>
      <NavLink isActive={isActive} onClick={onClick} {...rest}>
        <NavLinkInner>{children}</NavLinkInner>
      </NavLink>
    </Link>
  )
}

export function Header() {
  const { chainId } = useWeb3()
  const { themeName, toggleTheme } = useThemeToggle()
  const [isBurgerOpened, setBurgerOpened] = useState(false)
  const [showDualGovernanceWarningBanner, setShowDualGovernanceWarningBanner] =
    useState(false)

  const useDualGovernanceWarningModal = getUseModal(DualGovernanceWarningModal)

  const { openModal } = useDualGovernanceWarningModal()

  const {
    data: dualGovernanceStateData,
    initialLoading: dualGovernanceStateInitialLoading,
  } = useDualGovernanceState()

  useEffect(() => {
    if (!dualGovernanceStateData || dualGovernanceStateInitialLoading) {
      return
    }

    if (
      [
        DualGovernanceStatus.VetoSignalling,
        DualGovernanceStatus.RageQuit,
        DualGovernanceStatus.VetoSignallingDeactivation,
      ].includes(dualGovernanceStateData.status)
    ) {
      setShowDualGovernanceWarningBanner(true)
      openModal()
    }
  }, [dualGovernanceStateData, dualGovernanceStateInitialLoading, openModal])

  const handleCloseMobileMenu = useCallback(() => setBurgerOpened(false), [])
  const handleClickToggleTheme = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      toggleTheme()
    },
    [toggleTheme],
  )
  useScrollLock(isBurgerOpened)

  return (
    <>
      {showDualGovernanceWarningBanner && <DualGovernanceWarningBanner />}
      <Wrap>
        <Nav>
          <Logo data-testid="lidoLogo" href="https://lido.fi">
            <LidoLogo />
          </Logo>
          <NavItems>
            <NavItem
              link={urls.home}
              activeOn={[
                { url: urls.home, exact: true },
                urls.voteIndex,
                urls.dashboardIndex,
              ]}
              data-testid="navVote"
            >
              Vote
            </NavItem>
            <NavItem link={urls.delegation} data-testid="navDelegation">
              Delegation
            </NavItem>
            <NavItem link={urls.settings} data-testid="navSettings">
              Settings
            </NavItem>
          </NavItems>
        </Nav>

        <InputWrap>
          <HeaderVoteInput />
        </InputWrap>

        <ActionsDesktop>
          <Network>
            <NetworkBulb
              color={getChainColor(chainId)}
              data-testid="networkIndicator"
            />
            <Text size="xs" weight={500} data-testid="network">
              {getChainName(chainId)}
            </Text>
          </Network>
          <NoSSRWrapper>
            <DualGovernanceStatusButton />
            <HeaderWallet />
          </NoSSRWrapper>
          <ThemeTogglerWrap>
            <ThemeToggler />
          </ThemeTogglerWrap>
        </ActionsDesktop>

        <NavBurger>
          <BurgerWrap
            isOpened={isBurgerOpened}
            onClick={() => setBurgerOpened(!isBurgerOpened)}
          >
            <BurgerLine />
            <BurgerLine />
            <BurgerLine />
          </BurgerWrap>
        </NavBurger>

        {isBurgerOpened && (
          <MobileMenu>
            <MobileMenuScroll>
              <MobileNavItems>
                <NavItem
                  link={urls.home}
                  activeOn={[
                    { url: urls.home, exact: true },
                    urls.voteIndex,
                    urls.dashboardIndex,
                  ]}
                  onClick={handleCloseMobileMenu}
                >
                  <NavLinkIconWrap>
                    <StarSvg />
                  </NavLinkIconWrap>{' '}
                  Vote
                </NavItem>
                <NavItem link={urls.delegation} onClick={handleCloseMobileMenu}>
                  <NavLinkIconWrap>
                    <DelegationSvg />
                  </NavLinkIconWrap>{' '}
                  Delegation
                </NavItem>
                <NavItem link={urls.settings} onClick={handleCloseMobileMenu}>
                  <NavLinkIconWrap>
                    <SettingsSvg />
                  </NavLinkIconWrap>{' '}
                  Settings
                </NavItem>
                <NavLink
                  href=""
                  isActive={false}
                  onClick={handleClickToggleTheme}
                >
                  <NavLinkInner>
                    <NavLinkIconWrap>
                      {themeName === ThemeName.light ? <Dark /> : <Light />}{' '}
                    </NavLinkIconWrap>
                    Switch to {themeName === ThemeName.light ? 'dark' : 'light'}{' '}
                    theme
                  </NavLinkInner>
                </NavLink>
              </MobileNavItems>
              <MobileNetworkWrap>
                <MobileNetworkLabel>Network</MobileNetworkLabel>
                <Network>
                  <NetworkBulb
                    color={getChainColor(chainId)}
                    data-testid="networkIndicator"
                  />
                  <Text size="xs" weight={500} data-testid="network">
                    {getChainName(chainId)}
                  </Text>
                </Network>
              </MobileNetworkWrap>
              <MobileDGWidgetWrap>
                <Text size="sm" color="secondary">
                  Dual Governance state
                </Text>
                <DualGovernanceStatusButton />
              </MobileDGWidgetWrap>
              <NoSSRWrapper>
                <HeaderWallet trimAddressSymbols={6} />
              </NoSSRWrapper>
            </MobileMenuScroll>
          </MobileMenu>
        )}
        <MobileSpacer />
      </Wrap>
    </>
  )
}
