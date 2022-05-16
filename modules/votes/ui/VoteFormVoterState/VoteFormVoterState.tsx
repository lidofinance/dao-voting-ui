import { useGovernanceSymbol } from 'modules/tokens/hooks/useGovernanceSymbol'

import { Text } from '@lidofinance/lido-ui'
import { VoterState } from 'modules/votes/types'

type Props = {
  canVote: boolean
  votePower: number
  voterState: VoterState
  isEnded: boolean
}

export function VoteFormVoterState({
  votePower,
  voterState,
  canVote,
  isEnded,
}: Props) {
  const { data: symbol } = useGovernanceSymbol()

  const isNotVoted = voterState === VoterState.NotVoted
  const isVotedYay = voterState === VoterState.VotedYay
  const isVotedNay = voterState === VoterState.VotedNay

  if (canVote && isNotVoted) {
    return (
      <Text size="xs" color="secondary">
        You can do vote this with{' '}
        <Text as="span" size="xs" color="text">
          {votePower} {symbol}
        </Text>
        <br />
        (this was your balance when the vote started)
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

        {canVote && (
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

        {isEnded === true && (
          <>
            <br />
            <Text size="xs" color="secondary">
              This vote is closed
            </Text>
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

  if (isEnded === true && !canVote) {
    return (
      <Text size="xs" color="secondary">
        This vote is closed
      </Text>
    )
  }

  return null
}
