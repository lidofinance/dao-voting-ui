import { useCallback } from 'react'
import { useVotePassedCallback } from 'modules/votes/hooks/useVotePassedCallback'

import Link from 'next/link'
import { Text } from '@lidofinance/lido-ui'
import { VoteStatusBanner } from 'modules/votes/ui/VoteStatusBanner'
import { VoteYesNoBar } from 'modules/votes/ui/VoteYesNoBar'
import { VoteDescription } from 'modules/votes/ui/VoteDescription'

import {
  Wrap,
  VoteBody,
  VoteTitle,
  VoteDescriptionWrap,
  VotesBarWrap,
  Footer,
  NeededToQuorum,
} from './DashboardVoteStyle'
import type { StartVoteEventObject } from 'generated/AragonVotingAbi'
import { Vote, VotePhase, VoteStatus } from 'modules/votes/types'
import { weiToNum } from 'modules/blockChain/utils/parseWei'
import { getVoteDetailsFormatted } from 'modules/votes/utils/getVoteDetailsFormatted'
import { formatFloatPct } from 'modules/shared/utils/formatFloatPct'
import * as urls from 'modules/network/utils/urls'

type Props = {
  voteId: number
  vote: Vote
  eventStart: { decoded: StartVoteEventObject } | null
  status: VoteStatus
  voteTime: number
  objectionPhaseTime: number
  executedAt?: number
  onPass: () => void
}

export function DashboardVote({
  voteId,
  vote,
  eventStart,
  status,
  voteTime,
  objectionPhaseTime,
  executedAt,
  onPass,
}: Props) {
  const {
    nayPct,
    yeaPct,
    yeaNum,
    nayNum,
    yeaPctOfTotalSupply,
    nayPctOfTotalSupplyFormatted,
    yeaPctOfTotalSupplyFormatted,
    startDate,
    totalSupply,
  } = getVoteDetailsFormatted(vote)

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
      <Wrap data-testid={`voteCardPreview-${voteId}`}>
        <VoteStatusBanner
          startDate={startDate}
          executedAt={executedAt}
          voteTime={voteTime}
          objectionPhaseTime={objectionPhaseTime}
          status={status}
          isEnded={isEnded}
          yeaNum={yeaNum}
          nayNum={nayNum}
          totalSupply={totalSupply}
          fontSize="xxs"
          minAcceptQuorum={weiToNum(vote.minAcceptQuorum)}
        />
        <VoteBody>
          <VoteTitle>Vote #{voteId}</VoteTitle>
          <VoteDescriptionWrap data-testid="voteDescription">
            <VoteDescription metadata={eventStart?.decoded.metadata} />
          </VoteDescriptionWrap>
        </VoteBody>
        <Footer>
          <VotesBarWrap>
            {vote.phase === VotePhase.Main && (
              <NeededToQuorum>
                <Text size="xxs" color="secondary">
                  Needed to quorum
                </Text>
                <Text size="xxs">
                  {neededToQuorum > 0 && !isEnded
                    ? `${neededToQuorumFormatted}%`
                    : '-'}
                </Text>
              </NeededToQuorum>
            )}

            <VoteYesNoBar
              yeaPct={yeaPct}
              nayPct={nayPct}
              yeaNum={yeaNum}
              nayNum={nayNum}
              yeaPctOfTotalSupply={yeaPctOfTotalSupplyFormatted}
              nayPctOfTotalSupply={nayPctOfTotalSupplyFormatted}
              showOnForeground
            />
          </VotesBarWrap>
        </Footer>
      </Wrap>
    </Link>
  )
}
