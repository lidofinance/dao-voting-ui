// import { Text as TextLocal } from 'modules/shared/ui/Common/Text'
import { Text, Identicon, trimAddress } from '@lidofinance/lido-ui'
import { FormattedDate } from 'modules/shared/ui/Utils/FormattedDate'
import { VoteScript } from '../VoteScript'
import { VoteDetailsCountdown } from '../VoteDetailsCountdown'
import { VoteStatusBanner } from '../VoteStatusBanner'
import {
  // VotesBarNay,
  // VotesBarWrap,
  // VotesBarYea,
  // VotesTitleWrap,
  // TextNay,
  // TextYay,
  Box,
  BoxRow,
  InfoRow,
  InfoLabel,
  InfoValue,
  VoteTitle,
  CreatorBadge,
  DataTable,
} from './VoteDetailsStyle'

import { Vote, VoteStatus } from 'modules/votes/types'
import { weiToNum } from 'modules/blockChain/utils/parseWei'
import { formatFloatPct } from 'modules/shared/utils/formatFloatPct'

function InfoRowFull({
  title,
  children,
}: {
  title: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <InfoRow>
      <InfoLabel>{title}</InfoLabel>
      {children && <InfoValue>{children}</InfoValue>}
    </InfoRow>
  )
}

type Props = {
  vote: Vote
  voteId: string
  status: VoteStatus
  voteTime: number
  objectionPhaseTime: number
  creator?: string
  isEnded: boolean
}

export function VoteDetails({
  status,
  vote,
  voteId,
  voteTime,
  objectionPhaseTime,
  creator,
  isEnded,
}: Props) {
  const nayNum = weiToNum(vote.nay)
  const yeaNum = weiToNum(vote.yea)
  const total = nayNum + yeaNum
  // const nayPct = total > 0 ? formatFloatPct(nayNum / total) : 0
  const yeaPct = total > 0 ? formatFloatPct(yeaNum / total) : 0

  const votingPower = weiToNum(vote.votingPower)
  const startDate = vote.startDate.toNumber()
  const endDate = startDate + voteTime

  return (
    <>
      <VoteStatusBanner
        startDate={startDate}
        endDate={endDate}
        voteTime={voteTime}
        objectionPhaseTime={objectionPhaseTime}
        status={status}
        isEnded={isEnded}
      />

      <VoteTitle>Vote #{voteId}</VoteTitle>

      <DataTable>
        <InfoRowFull title="Created by">
          {creator && (
            <CreatorBadge>
              <Identicon diameter={16} address={creator} />
              <div>{trimAddress(creator, 4)}</div>
            </CreatorBadge>
          )}
        </InfoRowFull>

        <VoteDetailsCountdown
          startDate={startDate}
          voteTime={voteTime - objectionPhaseTime}
          isEndedBeforeTime={isEnded}
        >
          {diff => (
            <InfoRowFull title="Objection phase will start in">
              {diff}
            </InfoRowFull>
          )}
        </VoteDetailsCountdown>

        <VoteDetailsCountdown
          startDate={startDate}
          voteTime={voteTime}
          isEndedBeforeTime={isEnded}
        >
          {diff => <InfoRowFull title="Time remaining">{diff}</InfoRowFull>}
        </VoteDetailsCountdown>

        <InfoRowFull title="Start date">
          <FormattedDate date={startDate} format="MMM DD, YYYY / hh:mm a" />
        </InfoRowFull>

        {!isEnded && (
          <InfoRowFull title="End date">
            <FormattedDate date={endDate} format="MMM DD, YYYY / hh:mm a" />
          </InfoRowFull>
        )}

        <InfoRowFull title="Support %">
          {yeaPct}%{' '}
          <Text as="span" color="secondary" size="xxs">
            (&gt;{weiToNum(vote.supportRequired) * 100}% needed)
          </Text>
        </InfoRowFull>

        <InfoRowFull title="Approval %">
          {formatFloatPct(yeaNum / votingPower, { floor: true })}%{' '}
          <Text as="span" color="secondary" size="xxs">
            (&gt;{weiToNum(vote.minAcceptQuorum) * 100}% needed)
          </Text>
        </InfoRowFull>

        <InfoRowFull title="Snapshot block">
          {vote.snapshotBlock.toString()}
        </InfoRowFull>
      </DataTable>

      <Box isCentered>
        Voting {isEnded ? 'ended at' : 'ends'}{' '}
        <FormattedDate date={endDate} format="MMMM DD, YYYY at hh:mm A" />
      </Box>

      <BoxRow>
        <Box>WIP</Box>
        <Box>WIP</Box>
        {/* <TextLocal size={12} weight={400} isCentered>
          Voting ends{' '}
          <FormattedDate
            date={endDate}
            format="MMMM DD, YYYY at hh:mm A"
          />
        </TextLocal> */}
      </BoxRow>

      {/* <VotesTitleWrap>
        <Text color="text" size="xxs">
          <TextNay>Nay: {Number(nayNum.toFixed(4))}</TextNay>{' '}
          <Text as="span" color="secondary" size="xxs">
            ({nayPct.toFixed(2)}%)
          </Text>
        </Text>
        <Text color="text" size="xxs">
          <TextYay>Yay: {Number(yeaNum.toFixed(4))}</TextYay>{' '}
          <Text as="span" color="secondary" size="xxs">
            ({yeaPct.toFixed(2)}%)
          </Text>
        </Text>
      </VotesTitleWrap>

      <VotesBarWrap>
        <VotesBarNay style={{ width: `${nayPct}%` }} />
        <VotesBarYea style={{ width: `${yeaPct}%` }} />
      </VotesBarWrap> */}
      <InfoRowFull title="Script" />
      <VoteScript script={vote.script} />
    </>
  )
}
