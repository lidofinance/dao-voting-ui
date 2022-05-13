import { useState, useEffect, useCallback } from 'react'

type Args = {
  startDate?: number
  voteTime?: number
  onPass?: () => void
}

export function useVotePassedCallback({ startDate, voteTime, onPass }: Args) {
  const checkIsPassed = useCallback(() => {
    if (!startDate || !voteTime) return null
    const now = Date.now() / 1000
    const end = startDate + voteTime
    return now >= end
  }, [voteTime, startDate])

  const [isPassed, setPassed] = useState(checkIsPassed())

  useEffect(() => {
    if (isPassed || isPassed === null || !startDate || !voteTime) return

    const interval = setInterval(() => {
      if (checkIsPassed()) {
        setPassed(true)
        onPass?.()
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [isPassed, checkIsPassed, startDate, voteTime, onPass])

  return isPassed
}
