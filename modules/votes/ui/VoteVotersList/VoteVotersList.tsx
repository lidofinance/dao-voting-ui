import { useMemo, useState } from 'react'

import { Wrap, ListRow, ListRowCell, ShowMoreBtn } from './VoteVotersListStyle'
import { Text, useBreakpoint } from '@lidofinance/lido-ui'

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
  const isMobile = useBreakpoint('md')

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

  const votersCount = useMemo(() => {
    return new Set(voteEvents.map(event => event.voter)).size
  }, [voteEvents])

  return (
    <Wrap>
      <>
        <ListRow>
          <ListRowCell>
            <Text size="xxs" strong>
              Voter &nbsp;
            </Text>
            <Text data-testid="votersAmount" size="xxs" color="secondary">
              {votersCount}
            </Text>
          </ListRowCell>
          <ListRowCell>
            <Text size="xxs" strong>
              Vote
            </Text>
          </ListRowCell>
          <ListRowCell>
            <Text size="xxs" strong>
              {isMobile ? `VP (${tokenData?.symbol})` : 'Voting Power'}
            </Text>
          </ListRowCell>
        </ListRow>
        {voteEvents.slice(0, limit).map((event, i) => (
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
