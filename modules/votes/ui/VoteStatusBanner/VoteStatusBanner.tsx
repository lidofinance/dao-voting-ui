import {
  Wrap,
  BannerText,
  InfoText,
  BadgePassed,
  BadgeFailed,
  BadgeOngoing,
} from './VoteStatusBannerStyle'
import { FormattedDate } from 'modules/shared/ui/Utils/FormattedDate'
import { VotePhasesTooltip } from '../VotePhasesTooltip'
import { VoteDetailsCountdown } from '../VoteDetailsCountdown'
import ClearIconSVG from 'assets/clear.com.svg.react'
import DoneIconSVG from 'assets/done.com.svg.react'

import { VoteStatus } from 'modules/votes/types'

type Props = {
  startDate: number
  endDate: number
  voteTime: number
  objectionPhaseTime: number
  isEnded: boolean
  status: VoteStatus
}

export function VoteStatusBanner({
  startDate,
  endDate,
  voteTime,
  objectionPhaseTime,
  isEnded,
  status,
}: Props) {
  const renderEndDate = () => (
    <InfoText>
      <FormattedDate date={endDate} format="DD MMM YYYY, hh:mm a" />
    </InfoText>
  )

  return (
    <VotePhasesTooltip placement="bottomLeft">
      <Wrap status={status}>
        {status === VoteStatus.ActiveMain && (
          <>
            <BadgeOngoing>1</BadgeOngoing>
            <BannerText>Main phase ends in</BannerText>
            <InfoText>
              <VoteDetailsCountdown
                startDate={startDate}
                voteTime={voteTime - objectionPhaseTime}
                isEndedBeforeTime={isEnded}
              />
            </InfoText>
          </>
        )}

        {status === VoteStatus.ActiveObjection && (
          <>
            <BadgeOngoing>2</BadgeOngoing>
            <BannerText>Objection phase ends in</BannerText>
            <InfoText>
              <VoteDetailsCountdown
                startDate={startDate}
                voteTime={voteTime}
                isEndedBeforeTime={isEnded}
              />
            </InfoText>
          </>
        )}

        {status === VoteStatus.Pending && (
          <>
            <BadgePassed>
              <DoneIconSVG />
            </BadgePassed>
            <BannerText>Passed (pending)</BannerText>
            {renderEndDate()}
          </>
        )}

        {status === VoteStatus.Passed && (
          <>
            <BadgePassed>
              <DoneIconSVG />
            </BadgePassed>
            <BannerText>Passed</BannerText>
            {renderEndDate()}
          </>
        )}

        {status === VoteStatus.Executed && (
          <>
            <BadgePassed>
              <DoneIconSVG />
            </BadgePassed>
            <BannerText>Passed (enacted)</BannerText>
            {renderEndDate()}
          </>
        )}

        {status === VoteStatus.Rejected && (
          <>
            <BadgeFailed>
              <ClearIconSVG />
            </BadgeFailed>
            <BannerText>Rejected</BannerText>
            {renderEndDate()}
          </>
        )}
      </Wrap>
    </VotePhasesTooltip>
  )
}
