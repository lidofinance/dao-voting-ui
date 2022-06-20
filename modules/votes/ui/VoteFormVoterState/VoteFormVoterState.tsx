import { useGovernanceSymbol } from 'modules/tokens/hooks/useGovernanceSymbol'

import { Text } from '@lidofinance/lido-ui'
import { VoterState, VoteStatus } from 'modules/votes/types'

type Props = {
  status: VoteStatus
  canVote: boolean
  canEnact: boolean
  votePower: number
  voterState: VoterState
  isEnded: boolean
}

export function VoteFormVoterState({
  status,
  canVote,
  canEnact,
  votePower,
  voterState,
  isEnded,
}: Props) {
  const { data: symbol } = useGovernanceSymbol()

  const isMainPhase = status === VoteStatus.ActiveMain
  const isObjPhase = status === VoteStatus.ActiveObjection
  const isNotVoted = voterState === VoterState.NotVoted
  const isVotedYay = voterState === VoterState.VotedYay
  const isVotedNay = voterState === VoterState.VotedNay

  const elVoteIsClosed = (
    <Text size="xs" color="secondary">
      This vote is closed
    </Text>
  )

  const elEnactText = (
    <Text size="xs" color="secondary">
      The voting period is closed and the vote has passed.
      <br />
      Anyone can now enact this vote to execute its action.
    </Text>
  )

  if (canVote && isNotVoted) {
    return (
      <Text size="xs" color="secondary">
        You can do vote this with{' '}
        <Text as="span" size="xs" color="text">
          {votePower} {symbol}
        </Text>
        <br />
        (this was your balance when the vote started)
        {status === VoteStatus.ActiveObjection && (
          <>
            <br />
            Only{' '}
            <Text as="span" size="xs" color="text">
              Nay
            </Text>{' '}
            available in objection phase
          </>
        )}
      </Text>
    )
  }

  if (isVotedYay || isVotedNay) {
    return (
      <>
        <Text size="xs" color="secondary">
          You voted{' '}
          <Text as="span" size="xs" color="text">
            {isVotedNay ? 'NAY' : 'YAY'}
          </Text>{' '}
          with{' '}
          <Text as="span" size="xs" color="text">
            {votePower} {symbol}
          </Text>
        </Text>

        {canVote && (isMainPhase || (isObjPhase && isVotedYay)) && (
          <>
            <br />
            <Text size="xs" color="secondary">
              You can{' '}
              <Text as="span" size="xs" color="text">
                change your vote
              </Text>{' '}
              while the voting period is open
            </Text>
          </>
        )}

        {canEnact && isEnded && (
          <>
            <br />
            {elEnactText}
          </>
        )}

        {!canEnact && isEnded && (
          <>
            <br />
            {elVoteIsClosed}
          </>
        )}
      </>
    )
  }

  if (isEnded === false && !canVote && Number(votePower) === 0) {
    return (
      <Text size="xs" color="secondary">
        You can not do vote because you had no {symbol} when the vote started
      </Text>
    )
  }

  if (canEnact) {
    return elEnactText
  }

  if (isEnded && !canVote) {
    return elVoteIsClosed
  }

  return null
}
