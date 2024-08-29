import { Text, useBreakpoint } from '@lidofinance/lido-ui'
import {
  Header,
  HeaderTitleWithIcon,
  InnerWrap,
  Wrap,
} from './PublicDelegateListStyle'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useProcessedPublicDelegatesList } from './useProcessedPublicDelegatesList'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { PublicDelegateListItem } from './PublicDelegateListItem'

import AragonSvg from 'assets/aragon.com.svg.react'

export function PublicDelegateList() {
  const { isWalletConnected } = useWeb3()
  const isMobile = useBreakpoint('md')

  const { data, initialLoading } = useProcessedPublicDelegatesList()

  if (!data || initialLoading) {
    return (
      <Wrap>
        <PageLoader />
      </Wrap>
    )
  }

  return (
    <Wrap>
      <Text size={isMobile ? 'xs' : 'md'} weight={700}>
        Public Delegate List
      </Text>
      <InnerWrap $connected={isWalletConnected}>
        {!isMobile && (
          <Header>
            <Text size="xxs" weight={700}>
              Delegate
            </Text>
            <HeaderTitleWithIcon>
              VP <AragonSvg />
            </HeaderTitleWithIcon>
            <Text size="xxs" weight={700}>
              From
            </Text>
            <p />
            <p />
          </Header>
        )}
        {data.map(delegate => (
          <PublicDelegateListItem
            key={delegate.address}
            delegate={delegate}
            isWalletConnected={isWalletConnected}
            isMobile={isMobile}
          />
        ))}
      </InnerWrap>
    </Wrap>
  )
}
