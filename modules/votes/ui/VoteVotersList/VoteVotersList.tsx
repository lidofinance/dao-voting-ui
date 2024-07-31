import type { BigNumber } from 'ethers'

import { useMemo, useState } from 'react'
import { useEnsNames } from 'modules/shared/hooks/useEnsNames'
import { useGovernanceSymbol } from 'modules/tokens/hooks/useGovernanceSymbol'

import { InfoLabel } from 'modules/shared/ui/Common/InfoRow'
import { AddressPop } from 'modules/shared/ui/Common/AddressPop'
import {
  Wrap,
  TitleWrap,
  ListRow,
  ListRowCell,
  AddressWrap,
  Identicon,
  CounterBadge,
  ShowMoreBtn,
} from './VoteVotersListStyle'
import { Tooltip, trimAddress } from '@lidofinance/lido-ui'

import { weiToNum } from 'modules/blockChain/utils/parseWei'
import { formatNumber } from 'modules/shared/utils/formatNumber'
import type { CastVoteEventObject } from 'generated/AragonVotingAbi'

type Props = {
  eventsVoted: CastVoteEventObject[]
}

const formatter = Intl.NumberFormat('en', {
  notation: 'compact',
  maximumSignificantDigits: 3,
})
const formatAmount = (amount: BigNumber) => {
  return formatter.format(weiToNum(amount))
}

const PAGE_SIZE = 10

export function VoteVotersList({ eventsVoted }: Props) {
  const { data: govSymbol } = useGovernanceSymbol()

  const addresses = useMemo(() => eventsVoted.map(e => e.voter), [eventsVoted])

  const { data: ensNameList } = useEnsNames(addresses)

  const [page, setPage] = useState(1)
  const handleShowMore = () => setPage(page + 1)

  return (
    <Wrap>
      <TitleWrap>
        <InfoLabel>Voted</InfoLabel>
        <CounterBadge>{eventsVoted.length}</CounterBadge>
      </TitleWrap>
      <div>
        {eventsVoted.slice(0, page * PAGE_SIZE).map((event, i) => (
          <ListRow key={`${event.voter}-${i}}`}>
            <ListRowCell>
              <AddressPop address={event.voter}>
                <AddressWrap>
                  <Identicon address={event.voter} diameter={20} />
                  {(ensNameList && ensNameList[i]) ||
                    trimAddress(event.voter, 4)}
                </AddressWrap>
              </AddressPop>
            </ListRowCell>
            <ListRowCell>{event.supports ? 'Yes' : 'No'}</ListRowCell>
            <ListRowCell>
              <Tooltip
                placement="top"
                title={formatNumber(weiToNum(event.stake), 6)}
              >
                <div>
                  {formatAmount(event.stake)} {govSymbol}
                </div>
              </Tooltip>
            </ListRowCell>
          </ListRow>
        ))}
        {eventsVoted.length > page * PAGE_SIZE && (
          <ShowMoreBtn onClick={handleShowMore}>Show more</ShowMoreBtn>
        )}
      </div>
    </Wrap>
  )
}
