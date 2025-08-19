import { useMemo } from 'react'
import {
  BadgeFailed,
  BadgeNoQuorum,
  BadgeOngoing,
  BadgePassed,
  BannerText,
  InfoText,
  Wrap,
} from './VoteStatusBannerStyle'
import { FormattedDate } from 'modules/shared/ui/Utils/FormattedDate'
import { VoteDetailsCountdown } from '../VoteDetailsCountdown'
import ClearIconSVG from 'assets/clear.com.svg.react'
import DoneIconSVG from 'assets/done.com.svg.react'
import DGIconSVG from 'assets/dg.com.svg.react'

import { VoteStatus } from 'modules/votes/types'
import { convertStatusToStyledVariant, VoteStatusFontSize } from './types'
import { ProposalStatus } from 'modules/dual-governance/types'

type Props = {
  startDate: number
  executedAt: number | undefined
  voteTime: number
  objectionPhaseTime: number
  isEnded: boolean
  fontSize: VoteStatusFontSize
  status: VoteStatus
  yeaNum: number
  nayNum: number
  totalSupply: number
  minAcceptQuorum: number
  voteDualGovernanceStatus: ProposalStatus | null
}

export function VoteStatusBanner({
  startDate,
  executedAt,
  voteTime,
  objectionPhaseTime,
  isEnded,
  fontSize,
  status,
  yeaNum,
  nayNum,
  totalSupply,
  minAcceptQuorum,
  voteDualGovernanceStatus,
}: Props) {
  const variant = convertStatusToStyledVariant(status)

  const quorumIsReached = useMemo(() => {
    if (totalSupply === 0) {
      return false
    }

    const yeaQuorum = yeaNum / totalSupply
    const nayQuorum = nayNum / totalSupply

    return yeaQuorum > minAcceptQuorum || nayQuorum > minAcceptQuorum
  }, [totalSupply, yeaNum, nayNum, minAcceptQuorum])

  const endDateEl = executedAt ? (
    <InfoText variant={variant}>
      <FormattedDate date={executedAt} format="DD MMM YYYY" />
    </InfoText>
  ) : null

  return (
    <Wrap data-testid="voteCardHeader" fontSize={fontSize} variant={variant}>
      {status === VoteStatus.ActiveMain && (
        <>
          <BadgeOngoing>1</BadgeOngoing>
          <BannerText variant={variant}>Main phase ends in</BannerText>
          <InfoText variant={variant}>
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
          <BannerText variant={variant}>Objection phase ends in</BannerText>
          <InfoText variant={variant}>
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
          <BannerText variant={variant}>Passed (pending)</BannerText>
        </>
      )}

      {status === VoteStatus.Passed && (
        <>
          <BadgePassed>
            <DoneIconSVG />
          </BadgePassed>
          <BannerText variant={variant}>Passed</BannerText>
          {endDateEl}
        </>
      )}

      {status === VoteStatus.Executed && (
        <>
          {voteDualGovernanceStatus === ProposalStatus.Cancelled && (
            <>
              <BadgeFailed>
                <DGIconSVG />
              </BadgeFailed>
              <BannerText variant={variant}>
                Cancelled in Dual Governance
              </BannerText>
            </>
          )}
          {voteDualGovernanceStatus &&
            voteDualGovernanceStatus !== ProposalStatus.Cancelled &&
            voteDualGovernanceStatus !== ProposalStatus.Executed && (
              <>
                <BadgeNoQuorum>
                  <DGIconSVG />
                </BadgeNoQuorum>
                <BannerText variant={variant}>
                  In Dual Governance review
                </BannerText>
              </>
            )}
          {(voteDualGovernanceStatus === ProposalStatus.Executed ||
            voteDualGovernanceStatus === null) && (
            <>
              <BadgePassed>
                <DoneIconSVG />
              </BadgePassed>
              <BannerText variant={variant}>Passed (enacted)</BannerText>
            </>
          )}
          {endDateEl}
        </>
      )}

      {status === VoteStatus.Rejected && quorumIsReached && (
        <>
          <BadgeFailed>
            <ClearIconSVG />
          </BadgeFailed>
          <BannerText variant={variant}>Rejected</BannerText>
        </>
      )}

      {status === VoteStatus.Rejected && !quorumIsReached && (
        <>
          <BadgeNoQuorum>
            <ClearIconSVG />
          </BadgeNoQuorum>
          <BannerText variant={variant}>No quorum</BannerText>
        </>
      )}
    </Wrap>
  )
}
