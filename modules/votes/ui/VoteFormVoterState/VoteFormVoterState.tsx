import { useGovernanceSymbol } from 'modules/tokens/hooks/useGovernanceSymbol'

import { Wrap } from './VoteFormVoterStateStyle'

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

  const renderText = () => {
    const elVoteIsClosed = <>This vote is closed</>

    const elEnactText = (
      <>
        The voting period is closed and the vote has passed.
        <br />
        Anyone can now enact this vote to execute its action.
      </>
    )

    if (canVote && isNotVoted) {
      return (
        <>
          You can do vote this with{' '}
          <b>
            {votePower} {symbol}
          </b>
          <br />
          (this was your balance when the vote started)
          {status === VoteStatus.ActiveObjection && (
            <>
              <br />
              Only <b>No</b> available in objection phase
            </>
          )}
        </>
      )
    }

    if (isVotedYay || isVotedNay) {
      return (
        <>
          You voted <b>{isVotedNay ? 'NO' : 'YES'}</b> with{' '}
          <b>
            {votePower} {symbol}
          </b>
          {canVote && (isMainPhase || (isObjPhase && isVotedYay)) && (
            <>
              <br />
              You can <b>change your vote</b> while the voting period is open
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
        <>
          You can not do vote because you had no {symbol} when the vote started
        </>
      )
    }

    if (canEnact) {
      return <>{elEnactText}</>
    }

    if (isEnded && !canVote) {
      return <>{elVoteIsClosed}</>
    }
  }

  return <Wrap>{renderText()}</Wrap>
}
