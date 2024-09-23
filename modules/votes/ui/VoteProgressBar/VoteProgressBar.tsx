import { Text } from '@lidofinance/lido-ui'
import { ProgressBar } from 'modules/shared/ui/Common/ProgressBar/ProgressBar'
import { VoteDetailsCountdown } from '../VoteDetailsCountdown'

import { MainPhaseCountWrap, ProgressWrap, Wrap } from './VoteProgressBarStyle'
import { VotePhase } from 'modules/votes/types'
import { useVoteTimeCountdown } from 'modules/votes/hooks/useVoteTimeCountdown'
import { useEffect, useMemo, useState } from 'react'

interface Props {
  startDate: number
  endDate: number
  voteTime: number
  objectionPhaseTime: number
  isEnded: boolean
  votePhase: VotePhase
}

export function VoteProgressBar({
  startDate,
  endDate,
  voteTime,
  objectionPhaseTime,
  isEnded,
  votePhase,
}: Props) {
  const defaultProgressValue = votePhase === VotePhase.Closed ? 100 : 0

  const [mainPhaseProgress, setMainPhaseProgress] =
    useState(defaultProgressValue)

  const [objectionPhaseProgress, setObjectionPhaseProgress] =
    useState(defaultProgressValue)

  const timeDeltaMainPhase = useVoteTimeCountdown(
    startDate,
    voteTime - objectionPhaseTime,
  )

  const timeDeltaObjectionPhase = useVoteTimeCountdown(startDate, voteTime)

  useEffect(() => {
    if (votePhase === VotePhase.Main) {
      const _progress =
        100 - (timeDeltaMainPhase.diff / (voteTime - objectionPhaseTime)) * 100

      // The minimum width for the filler to have a proper border radius is 3px
      setMainPhaseProgress(
        Math.min(_progress > 0 && _progress < 3 ? 3 : _progress, 100),
      )
    }
  }, [startDate, objectionPhaseTime, voteTime, timeDeltaMainPhase, votePhase])

  useEffect(() => {
    if (votePhase === VotePhase.Objection) {
      const _progress =
        100 - (timeDeltaObjectionPhase.diff / objectionPhaseTime) * 100

      // The minimum width for the filler to have a proper border radius is 3px
      setObjectionPhaseProgress(
        Math.min(_progress > 0 && _progress < 3 ? 3 : _progress, 100),
      )
    }
  }, [objectionPhaseTime, timeDeltaObjectionPhase, votePhase])

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000)
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timeZoneName: 'short',
    }
    return date.toLocaleString('en-US', options)
  }

  const formattedStartDate = useMemo(() => formatDate(startDate), [startDate])
  const formattedEndDate = useMemo(() => formatDate(endDate), [endDate])

  return (
    <Wrap>
      <ProgressWrap $alignDescription="flex-start" $width="65%">
        <MainPhaseCountWrap>
          <Text
            color={votePhase === VotePhase.Main ? 'primary' : 'secondary'}
            size="xxs"
          >
            Main phase{votePhase === VotePhase.Main ? ' ends in ' : ' ended'}
          </Text>
          <b>
            <VoteDetailsCountdown
              startDate={startDate}
              voteTime={voteTime - objectionPhaseTime}
              isEndedBeforeTime={isEnded}
            />
          </b>
        </MainPhaseCountWrap>
        <ProgressBar
          progress={mainPhaseProgress}
          fillerType={votePhase === VotePhase.Closed ? 'default' : 'active'}
          backgroundType={
            votePhase === VotePhase.Closed
              ? 'default'
              : votePhase === VotePhase.Main
              ? 'primary'
              : 'secondary'
          }
        />
        <div>{formattedStartDate} </div>
      </ProgressWrap>
      <ProgressWrap $alignDescription="flex-end" $width="40%">
        <Text
          color={votePhase === VotePhase.Objection ? 'primary' : 'secondary'}
          size="xxs"
        >
          {`Objection ${votePhase === VotePhase.Objection ? 'ends in ' : ''}`}

          {votePhase === VotePhase.Objection && (
            <b>
              <VoteDetailsCountdown
                startDate={startDate}
                voteTime={voteTime}
                isEndedBeforeTime={isEnded}
              />
            </b>
          )}
        </Text>
        <ProgressBar
          progress={objectionPhaseProgress}
          fillerType={votePhase === VotePhase.Closed ? 'default' : 'active'}
          backgroundType={
            votePhase === VotePhase.Closed
              ? 'default'
              : votePhase === VotePhase.Objection
              ? 'primary'
              : 'secondary'
          }
        />
        <div>{formattedEndDate}</div>
      </ProgressWrap>
    </Wrap>
  )
}
