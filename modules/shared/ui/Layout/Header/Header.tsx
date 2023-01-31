import { useState, useCallback } from 'react'
import { useRouter } from 'next/dist/client/router'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useScrollLock } from 'modules/shared/hooks/useScrollLock'
import { usePrefixedPush } from 'modules/network/hooks/usePrefixedHistory'

import { Text } from 'modules/shared/ui/Common/Text'
import { HeaderWallet } from '../HeaderWallet'
import { ThemeToggler } from '@lidofinance/lido-ui'
import { HeaderVoteInput } from 'modules/votes/ui/HeaderVoteInput'
import {
  Wrap,
  Logo,
  Nav,
  NavItems,
  NavLink,
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
  HeaderSpacer,
  NavBurger,
  ThemeTogglerWrap,
} from './HeaderStyle'

import { getChainName } from 'modules/blockChain/chains'
import { getChainColor } from '@lido-sdk/constants'
import LidoLogoSvg from 'assets/logo.com.svg.react'
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
  const push = usePrefixedPush()

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      push(link)
      onClick?.(e)
    },
    [link, onClick, push],
  )

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
    <NavLink isActive={isActive} onClick={handleClick}>
      <div>{children}</div>
    </NavLink>
  )
}

export function Header() {
  const { chainId } = useWeb3()
  const [isBurgerOpened, setBurgerOpened] = useState(false)
  const handleCloseMobileMenu = useCallback(() => setBurgerOpened(false), [])
  useScrollLock(isBurgerOpened)

  return (
    <>
      <HeaderSpacer />
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
          <Network>
            <NetworkBulb color={getChainColor(chainId)} />
            <Text size={14} weight={500}>
              {getChainName(chainId)}
            </Text>
          </Network>
          <HeaderWallet />
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
                  Vote
                </NavItem>
                <NavItem link={urls.settings} onClick={handleCloseMobileMenu}>
                  Settings
                </NavItem>
              </MobileNavItems>
              <MobileNetworkWrap>
                <ThemeTogglerWrap>
                  <ThemeToggler />
                </ThemeTogglerWrap>
                <HeaderWallet />
                <Network>
                  <Text size={14} weight={500}>
                    {getChainName(chainId)}
                  </Text>
                  <NetworkBulb color={getChainColor(chainId)} />
                </Network>
              </MobileNetworkWrap>
            </MobileMenuScroll>
          </MobileMenu>
        )}
        <MobileSpacer />
      </Wrap>
    </>
  )
}
