import { useMemo } from 'react'
import { getVoteDetailsFormatted } from '../utils/getVoteDetailsFormatted'

type Args = Partial<Parameters<typeof getVoteDetailsFormatted>[0]>

export const useVoteDetailsFormatted = ({ vote, voteTime }: Args) => {
  return useMemo(
    () =>
      vote && voteTime
        ? getVoteDetailsFormatted({ vote, voteTime })
        : undefined,
    [vote, voteTime],
  )
}
