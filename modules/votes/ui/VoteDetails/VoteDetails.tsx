import { DataTable, DataTableRow, Text } from '@lidofinance/lido-ui'
import { FormattedDate } from 'modules/shared/ui/Utils/FormattedDate'
import { VoteScript } from '../VoteScript'
import { VoteDetailsCountdown } from '../VoteDetailsCountdown'
import {
  StatusText,
  VotesBarNay,
  VotesBarWrap,
  VotesBarYea,
  VotesTitleWrap,
  TextNay,
  TextYay,
} from './VoteDetailsStyle'

import { getVoteStatusText } from '../../utils/getVoteStatusText'
import { Vote, VoteStatus } from 'modules/votes/types'
import { weiToNum } from 'modules/blockChain/utils/parseWei'

type Props = {
  vote: Vote
  status: VoteStatus
  voteTime: number
  isEnded: boolean
}

const formatFloatPct = (pct: number) => {
  if (pct < 0.01) {
    return Math.ceil(pct * 10000) / 100
  } else if (pct > 0.99) {
    return Math.floor(pct * 10000) / 100
  }
  return Math.round(pct * 10000) / 100
}

export function VoteDetails({ status, vote, voteTime, isEnded }: Props) {
  const nayNum = weiToNum(vote.nay)
  const yeaNum = weiToNum(vote.yea)
  const total = nayNum + yeaNum
  const nayPct = total > 0 ? formatFloatPct(nayNum / total) : 0
  const yeaPct = total > 0 ? formatFloatPct(yeaNum / total) : 0

  const votingPower = weiToNum(vote.votingPower)

  return (
    <>
      <DataTable>
        <DataTableRow title="Status">
          <StatusText status={status}>{getVoteStatusText(status)}</StatusText>
        </DataTableRow>

        <VoteDetailsCountdown
          isEndedBeforeTime={isEnded}
          voteTime={voteTime}
          startDate={vote.startDate.toNumber()}
        />

        <DataTableRow title="Start date">
          <FormattedDate
            date={vote.startDate.toNumber()}
            format="MMM DD, YYYY / hh:mm a"
          />
        </DataTableRow>

        {!isEnded && (
          <DataTableRow title="End date">
            <FormattedDate
              date={vote.startDate.toNumber() + voteTime}
              format="MMM DD, YYYY / hh:mm a"
            />
          </DataTableRow>
        )}

        <DataTableRow title="Support %">
          {yeaPct}%{' '}
          <Text as="span" color="secondary" size="xxs">
            (&gt;{weiToNum(vote.supportRequired) * 100}% needed)
          </Text>
        </DataTableRow>

        <DataTableRow title="Minimum approval %">
          {formatFloatPct(yeaNum / votingPower)}%{' '}
          <Text as="span" color="secondary" size="xxs">
            (&gt;{weiToNum(vote.minAcceptQuorum) * 100}% needed)
          </Text>
        </DataTableRow>

        <DataTableRow title="Snapshot block">
          {vote.snapshotBlock.toString()}
        </DataTableRow>
      </DataTable>

      <VotesTitleWrap>
        <Text color="text" size="xxs">
          <TextNay>Nay: {nayNum}</TextNay>{' '}
          <Text as="span" color="secondary" size="xxs">
            ({nayPct.toFixed(2)}%)
          </Text>
        </Text>
        <Text color="text" size="xxs">
          <TextYay>Yay: {yeaNum}</TextYay>{' '}
          <Text as="span" color="secondary" size="xxs">
            ({yeaPct.toFixed(2)}%)
          </Text>
        </Text>
      </VotesTitleWrap>

      <VotesBarWrap>
        <VotesBarNay style={{ width: `${nayPct}%` }} />
        <VotesBarYea style={{ width: `${yeaPct}%` }} />
      </VotesBarWrap>

      <VoteScript script={vote.script} />
    </>
  )
}
