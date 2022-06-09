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
import { formatFloatPct } from 'modules/shared/utils/formatFloatPct'

type Props = {
  vote: Vote
  status: VoteStatus
  voteTime: number
  objectionPhaseTime: number
  isEnded: boolean
}

export function VoteDetails({
  status,
  vote,
  voteTime,
  objectionPhaseTime,
  isEnded,
}: Props) {
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
          title="Objection phase will start in"
          startDate={vote.startDate.toNumber()}
          voteTime={voteTime - objectionPhaseTime}
          isEndedBeforeTime={isEnded}
        />

        <VoteDetailsCountdown
          title="Time remaining"
          startDate={vote.startDate.toNumber()}
          voteTime={voteTime}
          isEndedBeforeTime={isEnded}
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
      </VotesBarWrap>

      <VoteScript script={vote.script} />
    </>
  )
}
