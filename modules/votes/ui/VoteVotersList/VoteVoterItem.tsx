import { VoteEvent } from 'modules/votes/types'
import { useState } from 'react'
import { utils } from 'ethers'
import {
  AddressLabel,
  AddressWrap,
  ListRow,
  ListRowCell,
} from './VoteVotersListStyle'
import { AddressPop } from 'modules/shared/ui/Common/AddressPop'
import { getPublicDelegateByAddress } from 'modules/delegation/utils/getPublicDelegateName'
import { PublicDelegateAvatar } from 'modules/delegation/ui/PublicDelegateAvatar'
import {
  ArrowBottom,
  Identicon,
  Text,
  Tooltip,
  trimAddress,
} from '@lidofinance/lido-ui'
import { formatBalance } from 'modules/blockChain/utils/formatBalance'
import { weiToNum } from 'modules/blockChain/utils/parseWei'
import { formatNumber } from 'modules/shared/utils/formatNumber'

import UnionIcon from 'assets/union.com.svg.react'
import DelegatorArrowIcon from 'assets/delegator-arrow.com.svg.react'

type Props = {
  voteEvent: VoteEvent
  governanceTokenSymbol: string
  ensMap: Record<string, string | null> | undefined
  isMobile: boolean
  isDelegated?: boolean
}

export const VoteVoterItem = ({
  voteEvent,
  governanceTokenSymbol,
  ensMap,
  isDelegated,
  isMobile,
}: Props) => {
  const [isDelegatorsListVisible, setIsDelegatorsListVisible] = useState(false)

  const { voter, delegatedVotes, supports, stake } = voteEvent

  const delegatedVotesLength = delegatedVotes?.length || 0
  const isDelegate = delegatedVotesLength > 0

  const publicDelegate = getPublicDelegateByAddress(voter)

  const handleExpandClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (isDelegate) {
      setIsDelegatorsListVisible(!isDelegatorsListVisible)
    }
  }

  const vpElement = (
    <Text weight={isDelegate ? 700 : 400} size="xxs" data-testid="votingPower">
      {formatBalance(stake, 1)} {isMobile ? '' : governanceTokenSymbol}
    </Text>
  )

  return (
    <>
      <ListRow
        data-testid="votersRow"
        $isDelegate={isDelegate}
        $isExpanded={isDelegatorsListVisible}
        $isDelegated={isDelegated}
        onClick={handleExpandClick}
      >
        <ListRowCell>
          <AddressPop address={voter}>
            <AddressWrap data-testid="voterAddress">
              {isDelegated && <DelegatorArrowIcon />}
              {publicDelegate ? (
                <>
                  <PublicDelegateAvatar
                    avatarSrc={publicDelegate.avatar}
                    size={20}
                  />
                  {publicDelegate.name}
                </>
              ) : (
                <>
                  <Identicon address={voter} diameter={20} />
                  <AddressLabel>
                    {ensMap?.[voter] ?? trimAddress(voter, 4)}
                  </AddressLabel>
                </>
              )}
              {(isDelegate || isDelegated) && <UnionIcon />}
            </AddressWrap>
          </AddressPop>
        </ListRowCell>
        <ListRowCell data-testid="voteStats">
          {supports ? 'Yes' : 'No'} {isDelegate && `(${delegatedVotesLength})`}
        </ListRowCell>
        <ListRowCell>
          {stake.gt(utils.parseEther('1000')) ? (
            <Tooltip placement="top" title={formatNumber(weiToNum(stake), 6)}>
              {vpElement}
            </Tooltip>
          ) : (
            vpElement
          )}
          {isDelegate && <ArrowBottom width={20} height={20} color="#7A8AA0" />}
        </ListRowCell>
      </ListRow>
      {isDelegatorsListVisible &&
        delegatedVotes?.map(vote => (
          <VoteVoterItem
            key={vote.voter}
            voteEvent={vote}
            governanceTokenSymbol={governanceTokenSymbol}
            ensMap={ensMap}
            isMobile={isMobile}
            isDelegated={true}
          />
        ))}
    </>
  )
}
