import { useMemo } from 'react'
import { Link, Text } from '@lidofinance/lido-ui'
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
  VoteTimestamps,
  VoteTitle,
} from './VoteDetailsStyle'
import { VoteDescription } from '../VoteDescription'

import { CastVoteEvent, Vote, VotePhase, VoteStatus } from 'modules/votes/types'
import { weiToNum } from 'modules/blockChain/utils/parseWei'
import { getVoteDetailsFormatted } from 'modules/votes/utils/getVoteDetailsFormatted'
import { VoteStatusChips } from '../VoteStatusChips'
import { VoteVotersList } from '../VoteVotersList'
import { VoteProgressBar } from 'modules/votes/ui/VoteProgressBar'
import { getEtherscanTxLink } from '@lido-sdk/helpers'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

const localeDateOptions = {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: false,
  timeZoneName: 'short',
}

const formatDate = (date: number) =>
  new Date(date * 1000).toLocaleDateString(
    'en-US',
    localeDateOptions as Intl.DateTimeFormatOptions,
  )

type Props = {
  vote: Vote
  voteId: string
  status: VoteStatus
  voteTime: number
  objectionPhaseTime: number
  metadata?: string
  isEnded: boolean
  eventsVoted: CastVoteEvent[] | undefined
  executedAt?: number
  executedTxHash?: string
  startedTxHash?: string
  eventsDelegatesVoted: AttemptCastVoteAsDelegateEventObject[] | undefined
  votePhase: VotePhase | undefined
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
  startedTxHash,
  eventsDelegatesVoted,
  executedAt,
  votePhase,
}: Props) {
  const { chainId } = useWeb3()
  const {
    totalSupply,
    nayNum,
    yeaNum,
    nayPct,
    yeaPct,
    nayPctOfTotalSupplyFormatted,
    yeaPctOfTotalSupplyFormatted,
    startDate,
  } = getVoteDetailsFormatted(vote)

  const formattedDate = useMemo(() => {
    if (!executedAt) return `Started ${formatDate(startDate)}`

    return `Enacted ${formatDate(executedAt)}`
  }, [executedAt, startDate])

  return (
    <>
      <VoteHeader data-testid="voteHeader">
        <VoteTitle data-testid="voteTitle">Vote #{voteId}</VoteTitle>
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
          <Text as="span" color="default" size="xxs" data-testid="blockNumber">
            {startedTxHash ? (
              <Link href={getEtherscanTxLink(chainId, startedTxHash)}>
                #{vote.snapshotBlock.toString()}
              </Link>
            ) : (
              `#${vote.snapshotBlock.toString()}`
            )}
          </Text>
        </BlockWrap>
      </VoteHeader>
      <VoteTimestamps>
        <Text color="secondary" size="xxs" data-testid="voteDate">
          {formattedDate}
        </Text>
      </VoteTimestamps>

      <DetailsBoxWrap>
        <BoxVotes data-testid="voteDetails">
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
          <DescriptionWrap data-testid="voteDescription">
            <VoteDescription metadata={metadata} allowMD />
          </DescriptionWrap>
        </DetailsBoxWrap>
      )}
      <DetailsBoxWrap data-testid="voteScript">
        <VoteScript script={vote.script} metadata={metadata} />
      </DetailsBoxWrap>
    </>
  )
}
