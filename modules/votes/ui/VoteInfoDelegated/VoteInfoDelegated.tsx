import { Text } from '@lidofinance/lido-ui'
import { AddressBadge } from 'modules/shared/ui/Common/AddressBadge'
import {
  InfoWrap,
  VoteStatus,
} from 'modules/votes/ui/VoteInfoDelegated/VoteInfoDelegatedStyle'
import { useDelegateVoteInfo } from 'modules/delegation/hooks/useDelegateVoteInfo'
import type {
  AttemptCastVoteAsDelegateEventObject,
  CastVoteEventObject,
} from 'generated/AragonVotingAbi'

interface Props {
  walletAddress: string | null | undefined
  eventsVoted: CastVoteEventObject[] | undefined
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

  return (
    <InfoWrap>
      <Text size="xxs" color="secondary">
        Delegate
      </Text>
      <AddressBadge address={voteInfo.delegate} />
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
