import { useGovernanceSymbol } from 'modules/tokens/hooks/useGovernanceSymbol'

import { Text } from '@lidofinance/lido-ui'
import { VoterState } from 'modules/votes/types'

type Props = {
  canVote: boolean
  votePower: string
  voterState: VoterState
}

export function VoteFormVoterState({ votePower, voterState, canVote }: Props) {
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
      </>
    )
  }

  return (
    <Text size="xs" color="secondary">
      You can not vote
    </Text>
  )
}
