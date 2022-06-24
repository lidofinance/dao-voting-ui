import { Button } from '@lidofinance/lido-ui'
import { Actions, PhasesTooltip } from './VoteFormActionsStyle'

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
  const yayBtn = (
    <Button
      children="Yay"
      loading={isSubmitting === 'yay'}
      disabled={
        (isSubmitting && isSubmitting !== 'yay') ||
        status === VoteStatus.ActiveObjection
      }
      onClick={() => onVote('yay')}
    />
  )

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
        {canVote && (
          <>
            {status === VoteStatus.ActiveObjection ? (
              <PhasesTooltip position="top-right">{yayBtn}</PhasesTooltip>
            ) : (
              yayBtn
            )}
          </>
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
