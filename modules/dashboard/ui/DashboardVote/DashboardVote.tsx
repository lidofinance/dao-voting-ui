import { useCallback } from 'react'
import { useVotePassedCallback } from 'modules/votes/hooks/useVotePassedCallback'
import { useVoteDetailsFormatted } from 'modules/votes/hooks/useVoteDetailsFormatted'

import Link from 'next/link'
import { VoteStatusBanner } from 'modules/votes/ui/VoteStatusBanner'
import { VoteYesNoBar } from 'modules/votes/ui/VoteYesNoBar'
import { InfoRowFull } from 'modules/shared/ui/Common/InfoRow'
import { VoteDescription } from 'modules/votes/ui/VoteDescription'

import {
  Wrap,
  VoteBody,
  VoteTitle,
  VoteDescriptionWrap,
  VotesBarWrap,
  Footer,
} from './DashboardVoteStyle'
import type { StartVoteEventObject } from 'generated/AragonVotingAbi'
import { Vote, VoteStatus } from 'modules/votes/types'
import * as urls from 'modules/network/utils/urls'

type Props = {
  voteId: number
  vote: Vote
  eventStart: StartVoteEventObject
  status: VoteStatus
  voteTime: number
  objectionPhaseTime: number
  onPass: () => void
}

export function DashboardVote({
  voteId,
  vote,
  eventStart,
  status,
  voteTime,
  objectionPhaseTime,
  onPass,
}: Props) {
  const {
    nayPct,
    yeaPct,
    nayPctOfTotalSupplyFormatted,
    yeaPctOfTotalSupplyFormatted,
    neededToQuorum,
    neededToQuorumFormatted,
    startDate,
    endDate,
  } = useVoteDetailsFormatted({ vote, voteTime })

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

  const isEnded =
    status === VoteStatus.Rejected || status === VoteStatus.Executed

  const { metadata } = eventStart

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

        <VoteBody>
          <VoteTitle>Vote #{voteId}</VoteTitle>
          <VoteDescriptionWrap>
            <VoteDescription metadata={metadata} />
          </VoteDescriptionWrap>
        </VoteBody>

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
            {neededToQuorum > 0 && !isEnded
              ? `${neededToQuorumFormatted}%`
              : '-'}
          </InfoRowFull>
        </Footer>
      </Wrap>
    </Link>
  )
}
