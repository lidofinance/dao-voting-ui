import { Text } from '@lidofinance/lido-ui'
import { FormattedDate } from 'modules/shared/ui/Utils/FormattedDate'
import { VoteScript } from '../VoteScript'
import { VoteDetailsCountdown } from '../VoteDetailsCountdown'
import { VoteStatusBanner } from '../VoteStatusBanner'
import { VotePhasesTooltip } from '../VotePhasesTooltip'
import { VoteYesNoBar } from '../VoteYesNoBar'
import { EvmScriptDescription } from 'modules/evmScriptDescription/ui/EvmScriptDescription'
import {
  BoxVotes,
  VoteTitle,
  CreatorBadge,
  DescriptionWrap,
  DataTable,
  DetailsBoxWrap,
} from './VoteDetailsStyle'
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
  metadata?: string
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
  metadata,
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
          {creator && <CreatorBadge address={creator} />}
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
          <FormattedDate date={startDate} format="MMM DD, YYYY / HH:mm" />
        </InfoRowFull>

        {!isEnded && (
          <InfoRowFull title="End date">
            <FormattedDate date={endDate} format="MMM DD, YYYY / HH:mm" />
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

      <DetailsBoxWrap>
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
          <FormattedDate date={endDate} format="MMMM DD, YYYY at HH:mm" />
        </ContentHighlightBox>
      </DetailsBoxWrap>

      <DetailsBoxWrap>
        <InfoRowFull title="Description" />
        <DescriptionWrap>
          <EvmScriptDescription vote={vote} metadata={metadata} />
        </DescriptionWrap>
      </DetailsBoxWrap>

      <DetailsBoxWrap>
        <InfoRowFull title="Script" />
        <VoteScript script={vote.script} />
      </DetailsBoxWrap>
    </>
  )
}
