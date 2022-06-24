import { useVoteTimeCountdown } from 'modules/votes/hooks/useVoteTimeCountdown'

import { DataTableRow } from '@lidofinance/lido-ui'

type Props = {
  title: React.ReactNode
  startDate: number
  voteTime: number
  isEndedBeforeTime: boolean
}

export function VoteDetailsCountdown({
  title,
  startDate,
  voteTime,
  isEndedBeforeTime,
}: Props) {
  const timeDelta = useVoteTimeCountdown(startDate, voteTime)

  if (timeDelta.isPassed || isEndedBeforeTime) {
    return null
  }

  return <DataTableRow title={title}>{timeDelta.diffFormatted}</DataTableRow>
}
