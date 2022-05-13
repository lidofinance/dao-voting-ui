import { Button } from '@lidofinance/lido-ui'
import { Actions } from './VoteFormActionsStyle'

import type { VoteMode } from '../../types'

type Props = {
  isSubmitting: false | VoteMode
  onVote: (mode: VoteMode) => void
}

export function VoteFormActions({ isSubmitting, onVote }: Props) {
  return (
    <Actions>
      <Button
        children="Nay"
        color="error"
        loading={isSubmitting === 'nay'}
        disabled={isSubmitting === 'yay'}
        onClick={() => onVote('nay')}
      />
      <Button
        children="Yay"
        loading={isSubmitting === 'yay'}
        disabled={isSubmitting === 'nay'}
        onClick={() => onVote('yay')}
      />
    </Actions>
  )
}
