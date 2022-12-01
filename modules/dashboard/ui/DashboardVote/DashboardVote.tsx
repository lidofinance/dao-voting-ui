import { Vote, VoteStatus } from 'modules/votes/types'

import Link from 'next/link'
import { VoteStatusBanner } from 'modules/votes/ui/VoteStatusBanner'
import { VoteYesNoBar } from 'modules/votes/ui/VoteYesNoBar'
import { InfoRowFull } from 'modules/shared/ui/Common/InfoRow'
import { Wrap, VoteTitle, VotesBarWrap, Footer } from './DashboardVoteStyle'

import { weiToNum } from 'modules/blockChain/utils/parseWei'
import { getVoteDetailsFormatted } from 'modules/votes/utils/getVoteDetailsFormatted'
import { formatFloatPct } from 'modules/shared/utils/formatFloatPct'
import * as urls from 'modules/network/utils/urls'

type Props = {
  id: number
  vote: Vote
  status: VoteStatus
  voteTime: number
  objectionPhaseTime: number
}

export function DashboardVote({
  id,
  vote,
  status,
  voteTime,
  objectionPhaseTime,
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

  const neededToQuorum = weiToNum(vote.minAcceptQuorum) - yeaPctOfTotalSupply
  const neededToQuorumFormatted = formatFloatPct(neededToQuorum, {
    floor: true,
  }).toFixed(2)

  const isEnded =
    status === VoteStatus.Rejected || status === VoteStatus.Executed

  return (
    <Link passHref href={urls.vote(id)}>
      <Wrap>
        <VoteStatusBanner
          startDate={startDate}
          endDate={endDate}
          voteTime={voteTime}
          objectionPhaseTime={objectionPhaseTime}
          status={status}
          isEnded={isEnded}
          size="small"
        />

        <VoteTitle>Vote #{id}</VoteTitle>

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
