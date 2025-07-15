import { useMemo, useState } from 'react'

import {
  Wrap,
  ListRow,
  ListRowCell,
  ShowMoreBtn,
  ListRowCellSortable,
} from './VoteVotersListStyle'
import { ArrowBottom, Text, useBreakpoint } from '@lidofinance/lido-ui'

import { VoteEvent } from 'modules/votes/types'
import { useGovernanceTokenData } from 'modules/tokens/hooks/useGovernanceTokenData'
import { VoteVoterItem } from './VoteVoterItem'
import { useEnsNames } from 'modules/shared/hooks/useEnsNames'

type Props = {
  voteEvents: VoteEvent[]
}

const INITIAL_PAGE_SIZE = 5

export function VoteVotersList({ voteEvents }: Props) {
  const { data: tokenData } = useGovernanceTokenData()
  const [vpSort, setVpSort] = useState<'asc' | 'desc' | undefined>(undefined)
  const isMobile = useBreakpoint('md')

  const handleVpSortClick = () => {
    switch (vpSort) {
      case 'desc':
        setVpSort('asc')
        break
      case 'asc':
        setVpSort(undefined)
        break
      default:
        setVpSort('desc')
        break
    }
  }

  const votersAddresses = useMemo(() => {
    const result = new Set<string>()
    voteEvents.forEach(({ voter, delegatedVotes }) => {
      result.add(voter)
      delegatedVotes?.forEach(({ voter: delegatedVoter }) => {
        result.add(delegatedVoter)
      })
    })
    return Array.from(result)
  }, [voteEvents])

  const { data: ensMap } = useEnsNames(votersAddresses)

  const [limit, setLimit] = useState(INITIAL_PAGE_SIZE)

  const totalVotersCount = useMemo(() => {
    return (
      voteEvents.length +
      voteEvents.reduce((acc, { delegatedVotes }) => {
        if (!delegatedVotes?.length) return acc

        return acc + delegatedVotes.length - 1 // -1 to not count the delegate itself
      }, 0)
    )
  }, [voteEvents])

  const sortedVoteEvents = useMemo(() => {
    if (!vpSort) return voteEvents
    return [...voteEvents].sort((a, b) => {
      if (vpSort === 'asc') {
        return a.stake.gt(b.stake) ? 1 : -1
      }
      return a.stake.gt(b.stake) ? -1 : 1
    })
  }, [voteEvents, vpSort])

  return (
    <Wrap>
      <>
        <ListRow>
          <ListRowCell>
            <Text size="xxs" strong>
              Voter &nbsp;
            </Text>
            <Text data-testid="votersAmount" size="xxs" color="secondary">
              {totalVotersCount}
            </Text>
          </ListRowCell>
          <ListRowCell>
            <Text size="xxs" strong>
              Vote
            </Text>
          </ListRowCell>
          <ListRowCellSortable
            $sortDirection={vpSort}
            onClick={handleVpSortClick}
          >
            <Text size="xxs" strong>
              {isMobile ? `VP (${tokenData?.symbol})` : 'Voting Power'}
            </Text>
            {vpSort && <ArrowBottom width={20} height={20} />}
          </ListRowCellSortable>
        </ListRow>
        {sortedVoteEvents.slice(0, limit).map((event, i) => (
          <VoteVoterItem
            voteEvent={event}
            governanceTokenSymbol={tokenData?.symbol || ''}
            ensMap={ensMap}
            isMobile={isMobile}
            key={`${event.voter}-${i}`}
          />
        ))}
        {voteEvents.length > limit && (
          <ShowMoreBtn
            data-testid="showMoreBtn"
            onClick={() => setLimit(voteEvents.length)}
          >
            Show all
          </ShowMoreBtn>
        )}
      </>
    </Wrap>
  )
}
