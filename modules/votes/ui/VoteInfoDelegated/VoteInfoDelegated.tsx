import { Identicon, Text, trimAddress } from '@lidofinance/lido-ui'
import {
  InfoWrap,
  VoteStatus,
  AddressBadgeWrap,
} from './VoteInfoDelegatedStyle'
import { useDelegateVoteInfo } from 'modules/delegation/hooks/useDelegateVoteInfo'
import { VoteEvent } from 'modules/votes/types'
import { getPublicDelegateByAddress } from 'modules/delegation/utils/getPublicDelegateName'
import { AddressPop } from 'modules/shared/ui/Common/AddressPop'
import { PublicDelegateAvatar } from 'modules/delegation/ui/PublicDelegateAvatar'

interface Props {
  walletAddress: string | null | undefined
  voteEvents: VoteEvent[]
}

export function VoteInfoDelegated({ walletAddress, voteEvents }: Props) {
  const delegateVoteInfo = useDelegateVoteInfo({
    walletAddress,
    voteEvents,
  })

  if (!delegateVoteInfo) {
    return null
  }

  const publicDelegate = getPublicDelegateByAddress(delegateVoteInfo.voter)

  return (
    <InfoWrap>
      <Text size="xxs" color="secondary">
        Delegate
      </Text>
      <AddressPop address={delegateVoteInfo.voter}>
        <AddressBadgeWrap>
          {publicDelegate ? (
            <PublicDelegateAvatar avatarSrc={publicDelegate.avatar} size={20} />
          ) : (
            <Identicon address={delegateVoteInfo.voter} diameter={20} />
          )}
          <Text
            as="span"
            size="xxs"
            color={publicDelegate ? 'default' : 'secondary'}
          >
            {publicDelegate?.name ?? trimAddress(delegateVoteInfo.voter, 4)}
          </Text>
        </AddressBadgeWrap>
      </AddressPop>
      <Text size="xxs" color="secondary">
        voted
      </Text>
      <VoteStatus $supports={delegateVoteInfo.supports}>
        <Text size="xxs" color="secondary">
          for
        </Text>
        <Text as="span" size="xxs" strong>
          {delegateVoteInfo.supports ? '“Yes”' : '“No”'}
        </Text>
      </VoteStatus>
    </InfoWrap>
  )
}
