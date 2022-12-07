import {
  Wrap,
  InfoText,
  BadgePassed,
  BadgeFailed,
  BadgeOngoing,
} from './VoteStatusBannerStyle'
import { FormattedDate } from 'modules/shared/ui/Utils/FormattedDate'
import { VoteDetailsCountdown } from '../VoteDetailsCountdown'
import ClearIconSVG from 'assets/clear.com.svg.react'
import DoneIconSVG from 'assets/done.com.svg.react'

import { VoteStatus } from 'modules/votes/types'
import { VoteStatusFontSize } from './types'

type Props = {
  startDate: number
  endDate: number
  voteTime: number
  objectionPhaseTime: number
  isEnded: boolean
  fontSize: VoteStatusFontSize
  status: VoteStatus
}

export function VoteStatusBanner({
  startDate,
  endDate,
  voteTime,
  objectionPhaseTime,
  isEnded,
  fontSize,
  status,
}: Props) {
  const endDateEl = (
    <InfoText>
      <FormattedDate date={endDate} format="DD MMM YYYY, hh:mm a" />
    </InfoText>
  )

  return (
    <Wrap fontSize={fontSize} status={status}>
      {status === VoteStatus.ActiveMain && (
        <>
          <BadgeOngoing>1</BadgeOngoing>
          <div>Main phase ends in</div>
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
          <div>Objection phase ends in</div>
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
          <div>Passed (pending)</div>
          {endDateEl}
        </>
      )}

      {status === VoteStatus.Passed && (
        <>
          <BadgePassed>
            <DoneIconSVG />
          </BadgePassed>
          <div>Passed</div>
          {endDateEl}
        </>
      )}

      {status === VoteStatus.Executed && (
        <>
          <BadgePassed>
            <DoneIconSVG />
          </BadgePassed>
          <div>Passed (enacted)</div>
          {endDateEl}
        </>
      )}

      {status === VoteStatus.Rejected && (
        <>
          <BadgeFailed>
            <ClearIconSVG />
          </BadgeFailed>
          <div>Rejected</div>
          {endDateEl}
        </>
      )}
    </Wrap>
  )
}
