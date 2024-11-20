import { Identicon, Text, trimAddress } from '@lidofinance/lido-ui'
import {
  InfoWrap,
  VoteStatus,
  AddressBadgeWrap,
} from './VoteInfoDelegatedStyle'
import { useDelegateVoteInfo } from 'modules/delegation/hooks/useDelegateVoteInfo'
import type { AttemptCastVoteAsDelegateEventObject } from 'generated/AragonVotingAbi'
import { CastVoteEvent } from 'modules/votes/types'
import { getPublicDelegateByAddress } from 'modules/delegation/utils/getPublicDelegateName'
import { AddressPop } from 'modules/shared/ui/Common/AddressPop'
import { PublicDelegateAvatar } from 'modules/delegation/ui/PublicDelegateAvatar'

interface Props {
  walletAddress: string | null | undefined
  eventsVoted: CastVoteEvent[] | undefined
  eventsDelegatesVoted: AttemptCastVoteAsDelegateEventObject[] | undefined
}

export function VoteInfoDelegated({
  walletAddress,
  eventsVoted,
  eventsDelegatesVoted,
}: Props) {
  const voteInfo = useDelegateVoteInfo({
    walletAddress,
    eventsVoted,
    eventsDelegatesVoted,
  })

  if (!voteInfo) {
    return null
  }

  const publicDelegate = getPublicDelegateByAddress(voteInfo.delegate)

  return (
    <InfoWrap>
      <Text size="xxs" color="secondary">
        Delegate
      </Text>
      <AddressPop address={voteInfo.delegate}>
        <AddressBadgeWrap>
          {publicDelegate ? (
            <PublicDelegateAvatar avatarSrc={publicDelegate.avatar} size={20} />
          ) : (
            <Identicon address={voteInfo.delegate} diameter={20} />
          )}
          <Text
            as="span"
            size="xxs"
            color={publicDelegate ? 'default' : 'secondary'}
          >
            {publicDelegate?.name ?? trimAddress(voteInfo.delegate, 4)}
          </Text>
        </AddressBadgeWrap>
      </AddressPop>
      <Text size="xxs" color="secondary">
        voted
      </Text>
      <VoteStatus $supports={voteInfo.supports}>
        <Text size="xxs" color="secondary">
          for
        </Text>
        <Text as="span" size="xxs" strong>
          {voteInfo.supports ? '“Yes”' : '“No”'}
        </Text>
      </VoteStatus>
    </InfoWrap>
  )
}
