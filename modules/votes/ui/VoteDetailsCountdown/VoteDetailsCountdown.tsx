import { useVoteTimeCountdown } from 'modules/votes/hooks/useVoteTimeCountdown'

import { DataTableRow } from '@lidofinance/lido-ui'

type Props = {
  voteTime: number
  startDate: number
}

export function VoteDetailsCountdown({ voteTime, startDate }: Props) {
  const timeDelta = useVoteTimeCountdown(voteTime, startDate)

  if (timeDelta.isPassed) return null

  return (
    <DataTableRow title="Time remaining">
      {timeDelta.diffFormatted}
    </DataTableRow>
  )
}
