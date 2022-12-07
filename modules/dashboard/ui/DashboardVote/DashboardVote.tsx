import { useCallback } from 'react'
import { useVotePassedCallback } from 'modules/votes/hooks/useVotePassedCallback'

import Link from 'next/link'
import { VoteStatusBanner } from 'modules/votes/ui/VoteStatusBanner'
import { VoteYesNoBar } from 'modules/votes/ui/VoteYesNoBar'
import { InfoRowFull } from 'modules/shared/ui/Common/InfoRow'
import { Wrap, VoteTitle, VotesBarWrap, Footer } from './DashboardVoteStyle'

import { Vote, VoteStatus } from 'modules/votes/types'
import { weiToNum } from 'modules/blockChain/utils/parseWei'
import { getVoteDetailsFormatted } from 'modules/votes/utils/getVoteDetailsFormatted'
import { formatFloatPct } from 'modules/shared/utils/formatFloatPct'
import * as urls from 'modules/network/utils/urls'

type Props = {
  voteId: number
  vote: Vote
  status: VoteStatus
  voteTime: number
  objectionPhaseTime: number
  onPass: () => void
}

export function DashboardVote({
  voteId,
  vote,
  status,
  voteTime,
  objectionPhaseTime,
  onPass,
}: Props) {
  const {
    nayPct,
    yeaPct,
    yeaPctOfTotalSupply,
    nayPctOfTotalSupplyFormatted,
    yeaPctOfTotalSupplyFormatted,
    startDate,
    endDate,
  } = getVoteDetailsFormatted({ vote, voteTime })

  const handlePass = useCallback(() => {
    // TODO:
    // Immediate revalidation glitches sometimes:
    // It appears accidentally when we fetch data that was changed immediately after the change. It returns it's old version from chain.
    // Small timeout is a fix for this glitch.
    // That's why there is timeout
    setTimeout(() => onPass(), 1200)
  }, [onPass])

  useVotePassedCallback({
    startDate,
    voteTime,
    onPass: handlePass,
  })

  useVotePassedCallback({
    startDate,
    voteTime: voteTime && objectionPhaseTime && voteTime - objectionPhaseTime,
    onPass: handlePass,
  })

  const neededToQuorum = weiToNum(vote.minAcceptQuorum) - yeaPctOfTotalSupply
  const neededToQuorumFormatted = formatFloatPct(neededToQuorum, {
    floor: true,
  }).toFixed(2)

  const isEnded =
    status === VoteStatus.Rejected || status === VoteStatus.Executed

  return (
    <Link passHref href={urls.vote(voteId)}>
      <Wrap>
        <VoteStatusBanner
          startDate={startDate}
          endDate={endDate}
          voteTime={voteTime}
          objectionPhaseTime={objectionPhaseTime}
          status={status}
          isEnded={isEnded}
          fontSize="xxs"
        />

        <VoteTitle>Vote #{voteId}</VoteTitle>

        <Footer>
          <VotesBarWrap>
            <VoteYesNoBar
              yeaPct={yeaPct}
              nayPct={nayPct}
              yeaPctOfTotalSupply={yeaPctOfTotalSupplyFormatted}
              nayPctOfTotalSupply={nayPctOfTotalSupplyFormatted}
              showOnForeground
            />
          </VotesBarWrap>

          <InfoRowFull title="Needed to quorum">
            {neededToQuorum > 0 ? `${neededToQuorumFormatted}%` : '-'}
          </InfoRowFull>
        </Footer>
      </Wrap>
    </Link>
  )
}
