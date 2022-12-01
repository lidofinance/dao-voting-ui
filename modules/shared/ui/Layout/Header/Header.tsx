import { useState, useCallback } from 'react'
import { useRouter } from 'next/dist/client/router'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useScrollLock } from 'modules/shared/hooks/useScrollLock'

import Link from 'next/link'
import { Text } from 'modules/shared/ui/Common/Text'
import { HeaderWallet } from '../HeaderWallet'
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
} from './HeaderStyle'

import { getChainName } from 'modules/blockChain/chains'
import { getChainColor } from '@lido-sdk/constants'
import LidoLogoSvg from 'assets/logo.com.svg.react'
import * as urls from 'modules/network/utils/urls'

function NavItem({
  link,
  onClick,
  children,
}: {
  link: string
  onClick?: React.MouseEventHandler<HTMLElement>
  children: React.ReactNode
}) {
  const router = useRouter()
  return (
    <Link passHref href={link}>
      <NavLink isActive={router.pathname.startsWith(link)} onClick={onClick}>
        <div>{children}</div>
      </NavLink>
    </Link>
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
            <NavItem link={urls.dashboard}>Vote</NavItem>
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
                <NavItem link={urls.dashboard} onClick={handleCloseMobileMenu}>
                  Vote
                </NavItem>
                <NavItem link={urls.settings} onClick={handleCloseMobileMenu}>
                  Settings
                </NavItem>
              </MobileNavItems>
              <MobileNetworkWrap>
                <Network>
                  <NetworkBulb color={getChainColor(chainId)} />
                  <Text size={14} weight={500}>
                    {getChainName(chainId)}
                  </Text>
                </Network>
                <HeaderWallet />
              </MobileNetworkWrap>
            </MobileMenuScroll>
          </MobileMenu>
        )}
        <MobileSpacer />
      </Wrap>
    </>
  )
}
