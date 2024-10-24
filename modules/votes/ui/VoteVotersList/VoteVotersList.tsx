import { useMemo, useState } from 'react'
import { useEnsNames } from 'modules/shared/hooks/useEnsNames'
import { useGovernanceSymbol } from 'modules/tokens/hooks/useGovernanceSymbol'
import UnionIcon from 'assets/union.com.svg.react'
import { DelegationAddressPop } from 'modules/delegation/ui/DelegationAddressPop'

import {
  Wrap,
  ListRow,
  ListRowCell,
  AddressWrap,
  ShowMoreBtn,
} from './VoteVotersListStyle'
import { Tooltip, trimAddress, Text, Identicon } from '@lidofinance/lido-ui'

import { weiToNum } from 'modules/blockChain/utils/parseWei'
import { formatNumber } from 'modules/shared/utils/formatNumber'
import type {
  CastVoteEventObject,
  AttemptCastVoteAsDelegateEventObject,
} from 'generated/AragonVotingAbi'
import { formatBalance } from 'modules/blockChain/utils/formatBalance'
import { getPublicDelegateByAddress } from 'modules/delegation/utils/getPublicDelegateName'
import { PublicDelegateAvatar } from 'modules/delegation/ui/PublicDelegateAvatar'

type Props = {
  eventsVoted: CastVoteEventObject[]
  eventsDelegatesVoted: AttemptCastVoteAsDelegateEventObject[] | undefined
}

const getDelegateVotesMap = (
  delegateEvents: AttemptCastVoteAsDelegateEventObject[] | undefined,
): Map<string, string | null> => {
  const map = new Map<string, string | null>()

  delegateEvents?.forEach(
    ({ delegate, voters }: AttemptCastVoteAsDelegateEventObject) => {
      voters.forEach(voter => {
        map.set(voter, delegate)
      })
    },
  )

  return map
}

// First we show 2 items, then add 10 more for every page
const INITIAL_PAGE_SIZE = 2
const PAGE_SIZE = 10

export function VoteVotersList({ eventsVoted, eventsDelegatesVoted }: Props) {
  const { data: govSymbol } = useGovernanceSymbol()

  const addresses = useMemo(() => eventsVoted.map(e => e.voter), [eventsVoted])
  const delegateVotesMap = useMemo(
    () => getDelegateVotesMap(eventsDelegatesVoted),
    [eventsDelegatesVoted],
  )

  const { data: ensNameList } = useEnsNames(addresses)

  const [limit, setLimit] = useState(INITIAL_PAGE_SIZE)

  const handleShowMore = () => {
    setLimit(limit + PAGE_SIZE)
  }
  const handleShowLess = () => {
    setLimit(INITIAL_PAGE_SIZE)
  }

  return (
    <Wrap>
      <>
        <ListRow>
          <ListRowCell>
            <Text size="xxs" strong>
              Voter &nbsp;
            </Text>
            <Text size="xxs" color="secondary">
              {eventsVoted.length}
            </Text>
          </ListRowCell>
          <ListRowCell>
            <Text size="xxs" strong>
              Vote
            </Text>
          </ListRowCell>
          <ListRowCell>
            <Text size="xxs" strong>
              Voting power
            </Text>
          </ListRowCell>
        </ListRow>
        {eventsVoted.slice(0, limit).map((event, i) => {
          const delegateAddress = delegateVotesMap.get(event.voter) || null
          const votedByDelegate = !!delegateAddress

          const publicDelegate = getPublicDelegateByAddress(event.voter)

          return (
            <ListRow key={`${event.voter}-${i}}`}>
              <ListRowCell>
                <DelegationAddressPop
                  address={event.voter}
                  delegateAddress={delegateAddress}
                >
                  {publicDelegate ? (
                    <AddressWrap>
                      <PublicDelegateAvatar
                        avatarSrc={publicDelegate.avatar}
                        size={20}
                      />
                      {publicDelegate.name}
                      {votedByDelegate && <UnionIcon />}
                    </AddressWrap>
                  ) : (
                    <AddressWrap>
                      <Identicon address={event.voter} diameter={20} />
                      {(ensNameList && ensNameList[i]) ||
                        trimAddress(event.voter, 4)}
                      {votedByDelegate && <UnionIcon />}
                    </AddressWrap>
                  )}
                </DelegationAddressPop>
              </ListRowCell>
              <ListRowCell>{event.supports ? 'Yes' : 'No'}</ListRowCell>
              <ListRowCell>
                <Tooltip
                  placement="top"
                  title={formatNumber(weiToNum(event.stake), 6)}
                >
                  <div>
                    {formatBalance(event.stake)} {govSymbol}
                  </div>
                </Tooltip>
              </ListRowCell>
            </ListRow>
          )
        })}
        {eventsVoted.length > limit && (
          <ShowMoreBtn onClick={handleShowMore}>Show more</ShowMoreBtn>
        )}
        {eventsVoted.length > INITIAL_PAGE_SIZE &&
          eventsVoted.length < limit && (
            <ShowMoreBtn onClick={handleShowLess}>Show less</ShowMoreBtn>
          )}
      </>
    </Wrap>
  )
}
