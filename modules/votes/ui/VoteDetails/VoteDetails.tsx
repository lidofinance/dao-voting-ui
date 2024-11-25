import { useMemo } from 'react'
import { Text } from '@lidofinance/lido-ui'
import type { AttemptCastVoteAsDelegateEventObject } from 'generated/AragonVotingAbi'
import { VoteScript } from '../VoteScript'
import { VoteYesNoBar } from '../VoteYesNoBar'
import {
  BlockWrap,
  BoxVotes,
  DescriptionWrap,
  DetailsBoxWrap,
  SectionHeading,
  VoteHeader,
  VoteTitle,
} from './VoteDetailsStyle'
import { VoteDescription } from '../VoteDescription'

import { CastVoteEvent, Vote, VotePhase, VoteStatus } from 'modules/votes/types'
import { weiToNum } from 'modules/blockChain/utils/parseWei'
import { getVoteDetailsFormatted } from 'modules/votes/utils/getVoteDetailsFormatted'
import { VoteStatusChips } from '../VoteStatusChips'
import { VoteVotersList } from '../VoteVotersList'
import { VoteProgressBar } from 'modules/votes/ui/VoteProgressBar'

type Props = {
  vote: Vote
  voteId: string
  status: VoteStatus
  voteTime: number
  objectionPhaseTime: number
  metadata?: string
  isEnded: boolean
  eventsVoted: CastVoteEvent[] | undefined
  executedTxHash?: string
  eventsDelegatesVoted: AttemptCastVoteAsDelegateEventObject[] | undefined
  votePhase: VotePhase | undefined
}

const localeDateOptions = {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: false,
  timeZoneName: 'short',
}

export function VoteDetails({
  status,
  vote,
  voteId,
  voteTime,
  objectionPhaseTime,
  metadata,
  isEnded,
  eventsVoted,
  executedTxHash,
  eventsDelegatesVoted,
  votePhase,
}: Props) {
  const {
    totalSupply,
    nayNum,
    yeaNum,
    nayPct,
    yeaPct,
    nayPctOfTotalSupplyFormatted,
    yeaPctOfTotalSupplyFormatted,
    startDate,
    endDate,
  } = getVoteDetailsFormatted({ vote, voteTime })

  const formattedEndDate = useMemo(
    () =>
      new Date(endDate * 1000).toLocaleDateString(
        'en-US',
        localeDateOptions as Intl.DateTimeFormatOptions,
      ),
    [endDate],
  )

  return (
    <>
      <VoteHeader>
        <VoteTitle>Vote #{voteId}</VoteTitle>
        <VoteStatusChips
          totalSupply={totalSupply}
          nayNum={nayNum}
          yeaNum={yeaNum}
          minAcceptQuorum={weiToNum(vote.minAcceptQuorum)}
          status={status}
          executedTxHash={executedTxHash}
          votePhase={votePhase}
        />
        <BlockWrap>
          <Text as="span" color="secondary" size="xxs">
            {'Block '}
          </Text>
          <Text as="span" color="default" size="xxs">
            #{vote.snapshotBlock.toString()}
          </Text>
        </BlockWrap>
      </VoteHeader>
      {votePhase === VotePhase.Closed && (
        <Text color="secondary" size="xxs">{`Ended ${formattedEndDate}`}</Text>
      )}
      <DetailsBoxWrap>
        <BoxVotes>
          <VoteYesNoBar
            yeaPct={yeaPct}
            nayPct={nayPct}
            yeaNum={yeaNum}
            nayNum={nayNum}
            yeaPctOfTotalSupply={yeaPctOfTotalSupplyFormatted}
            nayPctOfTotalSupply={nayPctOfTotalSupplyFormatted}
            showOnForeground
            showNumber
          />
        </BoxVotes>
      </DetailsBoxWrap>
      {(votePhase === VotePhase.Main || votePhase === VotePhase.Objection) && (
        <VoteProgressBar
          startDate={startDate}
          endDate={endDate}
          voteTime={voteTime}
          objectionPhaseTime={objectionPhaseTime}
          isEnded={isEnded}
          votePhase={votePhase}
        />
      )}
      {eventsVoted && eventsVoted.length > 0 && (
        <VoteVotersList
          eventsVoted={eventsVoted}
          eventsDelegatesVoted={eventsDelegatesVoted}
        />
      )}
      <SectionHeading>Proposal</SectionHeading>
      {metadata && (
        <DetailsBoxWrap>
          <DescriptionWrap>
            <VoteDescription metadata={metadata} allowMD />
          </DescriptionWrap>
        </DetailsBoxWrap>
      )}
      <DetailsBoxWrap>
        <VoteScript script={vote.script} metadata={metadata} />
      </DetailsBoxWrap>
    </>
  )
}
