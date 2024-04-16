import { useState, useCallback } from 'react'
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
} from './HeaderStyle'

import { getChainName } from 'modules/blockChain/chains'
import { getChainColor, CHAINS_COLORS } from '@lido-sdk/constants'
import LidoLogoSvg from 'assets/logo.com.svg.react'
import StarSvg from 'assets/star.com.svg.react'
import SettingsSvg from 'assets/settings.com.svg.react'
import * as urls from 'modules/network/utils/urls'

function NavItem({
  link,
  activeOn,
  onClick,
  children,
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
      <NavLink isActive={isActive} onClick={onClick}>
        <NavLinkInner>{children}</NavLinkInner>
      </NavLink>
    </Link>
  )
}

export function Header() {
  const { chainId } = useWeb3()
  const { themeName, toggleTheme } = useThemeToggle()
  const [isBurgerOpened, setBurgerOpened] = useState(false)
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
      <Wrap>
        <Nav>
          <Logo>
            <LidoLogoSvg />
          </Logo>
          <NavItems>
            <NavItem
              link={urls.home}
              activeOn={[
                { url: urls.home, exact: true },
                urls.voteIndex,
                urls.dashboardIndex,
              ]}
            >
              Vote
            </NavItem>
            <NavItem link={urls.settings}>Settings</NavItem>
          </NavItems>
        </Nav>

        <InputWrap>
          <HeaderVoteInput />
        </InputWrap>

        <ActionsDesktop>
          {chainId in CHAINS_COLORS ? (
            <Network>
              <NetworkBulb color={getChainColor(chainId)} />
              <Text size="xs" weight={500}>
                {getChainName(chainId)}
              </Text>
            </Network>
          ) : (
            <Text size="xs" weight={500}>
              unknown #{chainId}
            </Text>
          )}
          <NoSSRWrapper>
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
                {chainId in CHAINS_COLORS ? (
                  <Network>
                    <NetworkBulb color={getChainColor(chainId)} />
                    <Text size="xs" weight={500}>
                      {getChainName(chainId)}
                    </Text>
                  </Network>
                ) : (
                  <Text size="xs" weight={500}>
                    unknown #{chainId}
                  </Text>
                )}
              </MobileNetworkWrap>
              <HeaderWallet trimAddressSymbols={6} />
            </MobileMenuScroll>
          </MobileMenu>
        )}
        <MobileSpacer />
      </Wrap>
    </>
  )
}
