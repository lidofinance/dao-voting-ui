import { Button, Text, trimAddress } from '@lidofinance/lido-ui'
import Image from 'next/image'
import {
  DelegateInfo,
  Header,
  HeaderTitleWithIcon,
  InnerWrap,
  ListItem,
  Wrap,
  SocialButtons,
  AvatarWrap,
} from './PublicDelegateListStyle'
import { ExternalLink } from 'modules/shared/ui/Common/ExternalLink'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useProcessedPublicDelegatesList } from './useProcessedPublicDelegatesList'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { isValidAddress } from 'modules/shared/utils/addressValidation'
import { formatBalance } from 'modules/blockChain/utils/formatBalance'
import { AddressPop } from 'modules/shared/ui/Common/AddressPop'

import AragonSvg from 'assets/aragon.com.svg.react'
import XSocialSvg from 'assets/x.social.com.svg.react'
import LidoSocialSvg from 'assets/lido.social.com.svg.react'

type Props = {
  onDelegatePick: (address: string) => () => void
}

export function PublicDelegateList({ onDelegatePick }: Props) {
  const { isWalletConnected } = useWeb3()

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
      <Text size="md" weight={700}>
        Public Delegate List
      </Text>
      <InnerWrap $connected={isWalletConnected}>
        <Header>
          <Text size="xxs" weight={700}>
            Delegate
          </Text>
          <HeaderTitleWithIcon>
            VP <AragonSvg />
          </HeaderTitleWithIcon>
          <HeaderTitleWithIcon>
            From <AragonSvg />
          </HeaderTitleWithIcon>
          <p />
          <p />
        </Header>
        {data.map(delegate => (
          <ListItem key={delegate.address}>
            <DelegateInfo>
              <AvatarWrap>
                {delegate.avatar ? (
                  <Image
                    src={delegate.avatar}
                    alt=""
                    layout="fill"
                    loader={({ src }) => src}
                    unoptimized
                  />
                ) : (
                  <div />
                )}
              </AvatarWrap>
              <div>
                <Text size="xxs" weight={700}>
                  {delegate.name}
                </Text>
                <AddressPop address={delegate.address}>
                  <Text size="xxs" color="secondary">
                    {isValidAddress(delegate.address)
                      ? trimAddress(delegate.address, 6)
                      : delegate.address}
                  </Text>
                </AddressPop>
              </div>
            </DelegateInfo>
            <Text size="xxs">
              {delegate.delegatedVotingPower === 'N/A'
                ? delegate.delegatedVotingPower
                : formatBalance(delegate.delegatedVotingPower)}
            </Text>
            <Text size="xxs">{delegate.delegatorsCount}</Text>
            <SocialButtons>
              <ExternalLink href={delegate.twitter}>
                <XSocialSvg />
              </ExternalLink>
              <ExternalLink href={delegate.lido}>
                <LidoSocialSvg />
              </ExternalLink>
            </SocialButtons>
            {isWalletConnected && (
              <Button
                size="xs"
                variant="outlined"
                disabled={!delegate.resolvedDelegateAddress}
                onClick={onDelegatePick(delegate.resolvedDelegateAddress!)}
              >
                Delegate
              </Button>
            )}
          </ListItem>
        ))}
      </InnerWrap>
    </Wrap>
  )
}
