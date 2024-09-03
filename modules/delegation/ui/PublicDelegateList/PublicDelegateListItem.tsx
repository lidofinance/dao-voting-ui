import {
  DelegateInfo,
  DelegateNameAndAddress,
  DelegateNumbersMobile,
  HeaderTitleWithIcon,
  ListItem,
  SocialButtons,
} from './PublicDelegateListStyle'
import { ProcessedDelegate } from './useProcessedPublicDelegatesList'
import { Button, Text, trimAddress } from '@lidofinance/lido-ui'
import { AddressPop } from 'modules/shared/ui/Common/AddressPop'
import { isValidAddress } from 'modules/shared/utils/addressValidation'
import { formatBalance } from 'modules/blockChain/utils/formatBalance'
import { ExternalLink } from 'modules/shared/ui/Common/ExternalLink'
import { PublicDelegateAvatar } from './PublicDelegateAvatar'
import { useDelegateFromPublicList } from 'modules/delegation/providers/DelegateFromPublicListContext'

import XSocialSvg from 'assets/x.social.com.svg.react'
import LidoSocialSvg from 'assets/lido.social.com.svg.react'
import AragonSvg from 'assets/aragon.com.svg.react'

type Props = {
  delegate: ProcessedDelegate
  isWalletConnected: boolean
  isMobile: boolean
}

export function PublicDelegateListItem({
  delegate,
  isWalletConnected,
  isMobile,
}: Props) {
  const { onPublicDelegateSelect } = useDelegateFromPublicList()

  const addressToShow = isValidAddress(delegate.address)
    ? trimAddress(delegate.address, 6)
    : delegate.address

  const balanceToShow =
    delegate.delegatedVotingPower === 'N/A'
      ? delegate.delegatedVotingPower
      : formatBalance(delegate.delegatedVotingPower)

  if (isMobile) {
    return (
      <ListItem>
        <DelegateInfo>
          <PublicDelegateAvatar avatarSrc={delegate.avatar} />
          <DelegateNameAndAddress>
            <Text size="xxs" weight={700} title={delegate.name}>
              {delegate.name}
            </Text>
            <AddressPop address={delegate.address}>
              <Text size="xxs" color="secondary">
                {addressToShow}
              </Text>
            </AddressPop>
          </DelegateNameAndAddress>
          <SocialButtons>
            <ExternalLink href={delegate.lido}>
              <LidoSocialSvg viewBox="0 0 17 16" />
            </ExternalLink>
            {delegate.twitter && (
              <ExternalLink href={delegate.twitter}>
                <XSocialSvg viewBox="0 0 17 16" />
              </ExternalLink>
            )}
          </SocialButtons>
        </DelegateInfo>
        <DelegateNumbersMobile>
          <HeaderTitleWithIcon>
            VP <AragonSvg />
            {balanceToShow}
          </HeaderTitleWithIcon>
          <Text size="xxs" weight={700}>
            From {delegate.delegatorsCount}
          </Text>
        </DelegateNumbersMobile>
        {isWalletConnected && (
          <Button
            size="xs"
            variant="outlined"
            disabled={!delegate.resolvedDelegateAddress}
            onClick={onPublicDelegateSelect(delegate.resolvedDelegateAddress!)}
          >
            Select
          </Button>
        )}
      </ListItem>
    )
  }

  return (
    <ListItem>
      <DelegateInfo>
        <PublicDelegateAvatar avatarSrc={delegate.avatar} />
        <DelegateNameAndAddress>
          <Text size="xxs" weight={700} title={delegate.name}>
            {delegate.name}
          </Text>
          <AddressPop address={delegate.address}>
            <Text size="xxs" color="secondary">
              {addressToShow}
            </Text>
          </AddressPop>
        </DelegateNameAndAddress>
      </DelegateInfo>
      <Text size="xxs">{balanceToShow}</Text>
      <Text size="xxs">{delegate.delegatorsCount}</Text>
      <SocialButtons>
        <ExternalLink href={delegate.lido}>
          <LidoSocialSvg />
        </ExternalLink>
        {delegate.twitter && (
          <ExternalLink href={delegate.twitter}>
            <XSocialSvg />
          </ExternalLink>
        )}
      </SocialButtons>
      {isWalletConnected && (
        <Button
          size="xs"
          variant="outlined"
          disabled={!delegate.resolvedDelegateAddress}
          onClick={onPublicDelegateSelect(delegate.resolvedDelegateAddress!)}
        >
          Select
        </Button>
      )}
    </ListItem>
  )
}
