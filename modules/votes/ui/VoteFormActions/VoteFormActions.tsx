import { Button } from '@lidofinance/lido-ui'
import { Actions, PhasesTooltip, ButtonVote } from './VoteFormActionsStyle'
import CheckSVG from 'assets/check.com.svg.react'
import CrossSVG from 'assets/cross.com.svg.react'

import { VoteMode, VoterState, VoteStatus } from '../../types'

type Props = {
  status: VoteStatus
  canVote: boolean
  canEnact: boolean
  voterState: VoterState
  isSubmitting: false | VoteMode
  onVote: (mode: VoteMode) => void
  onEnact: () => void
}

export function VoteFormActions({
  status,
  canVote,
  canEnact,
  voterState,
  isSubmitting,
  onVote,
  onEnact,
}: Props) {
  if (!canVote && !canEnact) return null

  const yayBtn = (
    <ButtonVote
      loading={isSubmitting === 'yay'}
      color={
        voterState === VoterState.NotVoted
          ? 'primary'
          : voterState === VoterState.VotedYay
          ? 'success'
          : 'secondary'
      }
      disabled={
        (isSubmitting && isSubmitting !== 'yay') ||
        status === VoteStatus.ActiveObjection
      }
      onClick={() => onVote('yay')}
    >
      <CheckSVG />{' '}
      {voterState === VoterState.VotedYay
        ? 'Voted Yes'
        : voterState === VoterState.VotedNay
        ? 'Change Vote to Yes'
        : 'Vote Yes'}
    </ButtonVote>
  )

  return (
    <Actions>
      {canVote && (
        <ButtonVote
          loading={isSubmitting === 'nay'}
          color={
            voterState === VoterState.NotVoted
              ? 'primary'
              : voterState === VoterState.VotedNay
              ? 'error'
              : 'secondary'
          }
          disabled={isSubmitting && isSubmitting !== 'nay'}
          onClick={() => onVote('nay')}
        >
          <CrossSVG />{' '}
          {voterState === VoterState.VotedNay
            ? 'Voted No'
            : voterState === VoterState.VotedYay
            ? 'Change Vote to No'
            : 'Vote No'}
        </ButtonVote>
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
  )
}
