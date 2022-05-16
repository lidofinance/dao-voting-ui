import { useVoteTimeCountdown } from 'modules/votes/hooks/useVoteTimeCountdown'

import { DataTableRow } from '@lidofinance/lido-ui'

type Props = {
  isEndedBeforeTime: boolean
  voteTime: number
  startDate: number
}

export function VoteDetailsCountdown({
  isEndedBeforeTime,
  voteTime,
  startDate,
}: Props) {
  const timeDelta = useVoteTimeCountdown(voteTime, startDate)

  if (timeDelta.isPassed || isEndedBeforeTime) {
    return null
  }

  return (
    <DataTableRow title="Time remaining">
      {timeDelta.diffFormatted}
    </DataTableRow>
  )
}
