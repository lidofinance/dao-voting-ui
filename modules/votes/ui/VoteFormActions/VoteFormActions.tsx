import { Button } from '@lidofinance/lido-ui'
import { Actions } from './VoteFormActionsStyle'

import { VoteMode, VoteStatus } from '../../types'

type Props = {
  status: VoteStatus
  canVote: boolean
  canEnact: boolean
  isSubmitting: false | VoteMode
  onVote: (mode: VoteMode) => void
  onEnact: () => void
}

export function VoteFormActions({
  status,
  canVote,
  canEnact,
  isSubmitting,
  onVote,
  onEnact,
}: Props) {
  return (
    <>
      <Actions>
        {canVote && (
          <Button
            children="Nay"
            color="error"
            loading={isSubmitting === 'nay'}
            disabled={isSubmitting && isSubmitting !== 'nay'}
            onClick={() => onVote('nay')}
          />
        )}
        {canVote && status === VoteStatus.ActiveMain && (
          <Button
            children="Yay"
            loading={isSubmitting === 'yay'}
            disabled={isSubmitting && isSubmitting !== 'yay'}
            onClick={() => onVote('yay')}
          />
        )}
        {canEnact && (
          <Button
            color="success"
            children="Enact"
            loading={isSubmitting === 'enact'}
            disabled={isSubmitting && isSubmitting !== 'enact'}
            onClick={() => onEnact()}
          />
        )}
      </Actions>
    </>
  )
}
