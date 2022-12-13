import { Text, Identicon, trimAddress } from '@lidofinance/lido-ui'
import { FormattedDate } from 'modules/shared/ui/Utils/FormattedDate'
import { VoteScript } from '../VoteScript'
import { VoteDetailsCountdown } from '../VoteDetailsCountdown'
import { VoteStatusBanner } from '../VoteStatusBanner'
import { VotePhasesTooltip } from '../VotePhasesTooltip'
import { VoteYesNoBar } from '../VoteYesNoBar'
import {
  BoxVotes,
  VoteTitle,
  CreatorBadge,
  DataTable,
} from './VoteDetailsStyle'
import { AddressPop } from 'modules/shared/ui/Common/AddressPop'
import { ContentHighlightBox } from 'modules/shared/ui/Common/ContentHighlightBox'
import { InfoRowFull } from 'modules/shared/ui/Common/InfoRow'

import { Vote, VoteStatus } from 'modules/votes/types'
import { weiToNum } from 'modules/blockChain/utils/parseWei'
import { formatNumber } from 'modules/shared/utils/formatNumber'
import { getVoteDetailsFormatted } from 'modules/votes/utils/getVoteDetailsFormatted'

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
  const {
    totalSupplyFormatted,
    nayNum,
    yeaNum,
    nayPct,
    yeaPct,
    nayPctOfTotalSupplyFormatted,
    yeaPctOfTotalSupplyFormatted,
    startDate,
    endDate,
  } = getVoteDetailsFormatted({ vote, voteTime })

  return (
    <>
      <VotePhasesTooltip placement="bottomLeft" executedTxHash={executedTxHash}>
        <VoteStatusBanner
          startDate={startDate}
          endDate={endDate}
          voteTime={voteTime}
          objectionPhaseTime={objectionPhaseTime}
          status={status}
          isEnded={isEnded}
          fontSize="xs"
        />
      </VotePhasesTooltip>

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
          {yeaPctOfTotalSupplyFormatted}%&nbsp;
          <Text as="span" color="secondary" size="xxs">
            (&gt;{weiToNum(vote.minAcceptQuorum) * 100}% needed)
          </Text>
        </InfoRowFull>

        <InfoRowFull title={`“No” voted`}>
          {formatNumber(nayNum, 4)}&nbsp; / {totalSupplyFormatted}&nbsp;
          <Text as="span" color="secondary" size="xxs">
            ({nayPctOfTotalSupplyFormatted}%)
          </Text>
        </InfoRowFull>

        <InfoRowFull title={`“Yes” voted`}>
          {formatNumber(yeaNum, 4)}&nbsp; / {totalSupplyFormatted}&nbsp;
          <Text as="span" color="secondary" size="xxs">
            ({yeaPctOfTotalSupplyFormatted}%)
          </Text>
        </InfoRowFull>
      </DataTable>

      <BoxVotes>
        <VoteYesNoBar
          yeaPct={yeaPct}
          nayPct={nayPct}
          yeaPctOfTotalSupply={yeaPctOfTotalSupplyFormatted}
          nayPctOfTotalSupply={nayPctOfTotalSupplyFormatted}
        />
      </BoxVotes>

      <ContentHighlightBox isCentered>
        Voting {isEnded ? 'ended at' : 'ends'}{' '}
        <FormattedDate date={endDate} format="MMMM DD, YYYY at hh:mm A" />
      </ContentHighlightBox>

      <InfoRowFull title="Script" />
      <VoteScript script={vote.script} />
    </>
  )
}
