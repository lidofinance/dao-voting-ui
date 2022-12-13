import { Text, Identicon, trimAddress } from '@lidofinance/lido-ui'
import { FormattedDate } from 'modules/shared/ui/Utils/FormattedDate'
import { VoteScript } from '../VoteScript'
import { VoteDetailsCountdown } from '../VoteDetailsCountdown'
import { VoteStatusBanner } from '../VoteStatusBanner'
import {
  VotesBarNay,
  VotesBarWrap,
  VotesBarYea,
  VotesTitleWrap,
  Box,
  BoxVotes,
  InfoRow,
  InfoLabel,
  InfoValue,
  VoteTitle,
  CreatorBadge,
  DataTable,
} from './VoteDetailsStyle'
import { AddressPop } from 'modules/shared/ui/Common/AddressPop'

import { Vote, VoteStatus } from 'modules/votes/types'
import { weiToNum } from 'modules/blockChain/utils/parseWei'
import { formatFloatPct } from 'modules/shared/utils/formatFloatPct'
import { formatNumber } from 'modules/shared/utils/formatNumber'

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
  executedTxHash?: string
}

export function VoteDetails({
  status,
  vote,
  voteId,
  voteTime,
  objectionPhaseTime,
  creator,
  isEnded,
  executedTxHash,
}: Props) {
  const totalSupply = weiToNum(vote.votingPower)
  const totalSupplyFormatted = formatNumber(totalSupply, 4)
  const nayNum = weiToNum(vote.nay)
  const yeaNum = weiToNum(vote.yea)
  const total = nayNum + yeaNum

  const nayPct = total > 0 ? formatFloatPct(nayNum / total) : 0
  const yeaPct = total > 0 ? formatFloatPct(yeaNum / total) : 0

  const nayPctOfTotalSupply = totalSupply
    ? formatFloatPct(nayNum / totalSupply, { floor: true }).toFixed(2)
    : 0
  const yeaPctOfTotalSupply = totalSupply
    ? formatFloatPct(yeaNum / totalSupply, { floor: true }).toFixed(2)
    : 0

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
        executedTxHash={executedTxHash}
      />

      <VoteTitle>Vote #{voteId}</VoteTitle>

      <DataTable>
        <InfoRowFull title="Snapshot block">
          {vote.snapshotBlock.toString()}
        </InfoRowFull>

        <InfoRowFull title="Created by">
          {creator && (
            <AddressPop address={creator}>
              <CreatorBadge>
                <Identicon diameter={16} address={creator} />
                <div>{trimAddress(creator, 4)}</div>
              </CreatorBadge>
            </AddressPop>
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
          {yeaPct}%&nbsp;
          <Text as="span" color="secondary" size="xxs">
            (&gt;{weiToNum(vote.supportRequired) * 100}% needed)
          </Text>
        </InfoRowFull>

        <InfoRowFull title="Approval %">
          {yeaPctOfTotalSupply}%&nbsp;
          <Text as="span" color="secondary" size="xxs">
            (&gt;{weiToNum(vote.minAcceptQuorum) * 100}% needed)
          </Text>
        </InfoRowFull>

        <InfoRowFull title={`“No” voted`}>
          {formatNumber(nayNum, 4)}&nbsp; / {totalSupplyFormatted}&nbsp;
          <Text as="span" color="secondary" size="xxs">
            ({nayPctOfTotalSupply}%)
          </Text>
        </InfoRowFull>

        <InfoRowFull title={`“Yes” voted`}>
          {formatNumber(yeaNum, 4)}&nbsp; / {totalSupplyFormatted}&nbsp;
          <Text as="span" color="secondary" size="xxs">
            ({yeaPctOfTotalSupply}%)
          </Text>
        </InfoRowFull>
      </DataTable>

      <BoxVotes>
        <VotesTitleWrap>
          <Text size="xxs">
            <Text as="span" color="secondary" size="xxs">
              No —{' '}
            </Text>
            <Text as="span" size="xxs">
              {nayPctOfTotalSupply}%
            </Text>
          </Text>
          <Text size="xxs" style={{ textAlign: 'right' }}>
            <Text as="span" color="secondary" size="xxs">
              Yes —{' '}
            </Text>
            <Text as="span" size="xxs">
              {yeaPctOfTotalSupply}%
            </Text>
          </Text>
        </VotesTitleWrap>

        <VotesBarWrap>
          <VotesBarNay style={{ width: `${nayPct}%` }} />
          <VotesBarYea style={{ width: `${yeaPct}%` }} />
        </VotesBarWrap>
      </BoxVotes>

      <Box isCentered>
        Voting {isEnded ? 'ended at' : 'ends'}{' '}
        <FormattedDate date={endDate} format="MMMM DD, YYYY at hh:mm A" />
      </Box>

      <InfoRowFull title="Script" />
      <VoteScript script={vote.script} />
    </>
  )
}
