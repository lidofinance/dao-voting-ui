import { useState, useCallback } from 'react'
import { useRouter } from 'next/dist/client/router'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useScrollLock } from 'modules/shared/hooks/useScrollLock'

import Link from 'next/link'
import { Text } from 'modules/shared/ui/Common/Text'
import { HeaderWallet } from '../HeaderWallet'
import {
  Wrap,
  Logo,
  Nav,
  NavItems,
  NavLink,
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
} from './HeaderStyle'
import VoteSVG from './icons/vote.svg.react'
import SettingsSVG from './icons/settings.svg.react'

import { getChainName } from 'modules/blockChain/chains'
import { getChainColor } from '@lido-sdk/constants'
import LidoLogoSvg from 'assets/logo.com.svg.react'
import * as urls from 'modules/network/utils/urls'

function NavItem({
  link,
  icon,
  onClick,
  children,
}: {
  link: string
  icon: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLElement>
  children: React.ReactNode
}) {
  const router = useRouter()
  return (
    <Link passHref href={link}>
      <NavLink isActive={router.pathname.startsWith(link)} onClick={onClick}>
        {icon}
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
      <Wrap>
        <Nav>
          <Logo>
            <LidoLogoSvg />
          </Logo>
          <NavItems>
            <NavItem link={urls.voteIndex} icon={<VoteSVG />} children="Vote" />
            <NavItem
              link={urls.settings}
              icon={<SettingsSVG />}
              children="Settings"
            />
          </NavItems>
        </Nav>

        <ActionsDesktop>
          <Network>
            <NetworkBulb color={getChainColor(chainId)} />
            <Text size={14} weight={500}>
              {getChainName(chainId)}
            </Text>
          </Network>
          <HeaderWallet />
        </ActionsDesktop>

        <BurgerWrap
          isOpened={isBurgerOpened}
          onClick={() => setBurgerOpened(!isBurgerOpened)}
        >
          <BurgerLine />
          <BurgerLine />
          <BurgerLine />
        </BurgerWrap>

        {isBurgerOpened && (
          <MobileMenu>
            <MobileMenuScroll>
              <MobileNavItems>
                <NavItem
                  link={urls.voteIndex}
                  icon={<VoteSVG />}
                  children="Vote"
                  onClick={handleCloseMobileMenu}
                />
                <NavItem
                  link={urls.settings}
                  icon={<SettingsSVG />}
                  children="Settings"
                  onClick={handleCloseMobileMenu}
                />
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
      </Wrap>
      <MobileSpacer />
    </>
  )
}
