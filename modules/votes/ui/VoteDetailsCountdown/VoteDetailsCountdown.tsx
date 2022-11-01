import { useVoteTimeCountdown } from 'modules/votes/hooks/useVoteTimeCountdown'

type Props = {
  startDate: number
  voteTime: number
  isEndedBeforeTime: boolean
  children?: (diff: string) => React.ReactNode
}

export function VoteDetailsCountdown({
  startDate,
  voteTime,
  isEndedBeforeTime,
  children,
}: Props) {
  const timeDelta = useVoteTimeCountdown(startDate, voteTime)

  if (timeDelta.isPassed || isEndedBeforeTime) {
    return null
  }

  return (
    <>
      {children ? children(timeDelta.diffFormatted) : timeDelta.diffFormatted}
    </>
  )
}
