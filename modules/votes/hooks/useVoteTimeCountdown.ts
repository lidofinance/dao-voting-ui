import moment from 'moment'
import 'moment-duration-format'
import { useState, useCallback, useEffect } from 'react'

export type VoteTimeData = {
  isPassed: boolean
  diff: number
  diffFormatted: string
}

export function useVoteTimeCountdown(startDate: number, duration: number) {
  const getTimeLeft = useCallback((): VoteTimeData => {
    const now = Date.now() / 1000
    const diff = startDate + duration - now
    return {
      isPassed: diff < 0,
      diff: diff,
      diffFormatted: moment
        .duration(Math.abs(diff), 'seconds')
        // \xa0 is non-breaking space
        // @ts-ignore
        .format('HH: mm : ss', {
          trim: 'final',
          minValue: 1,
        }),
    }
  }, [startDate, duration])

  const [timeData, setTimeLeftState] = useState(getTimeLeft())
  const { isPassed, diffFormatted } = timeData

  const setTimeLeft = useCallback(
    (nextTimeLeft: VoteTimeData) => {
      if (diffFormatted !== nextTimeLeft.diffFormatted) {
        setTimeLeftState(nextTimeLeft)
      }
    },
    [diffFormatted],
  )

  useEffect(() => {
    if (isPassed) return
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 250)
    return () => {
      clearInterval(interval)
    }
  }, [isPassed, getTimeLeft, setTimeLeft])

  return timeData
}
