import { useGovernanceSymbol } from 'modules/tokens/hooks/useGovernanceSymbol'

import { Wrap } from './VoteFormVoterStateStyle'
import { FormattedDate } from 'modules/shared/ui/Utils/FormattedDate'

import { VoterState, VoteStatus } from 'modules/votes/types'

type Props = {
  status: VoteStatus
  canVote: boolean
  canEnact: boolean
  votePower: number
  voterState: VoterState
  snapshotBlock: number
  startDate: number
  isEnded: boolean
}

export function VoteFormVoterState({
  status,
  canVote,
  canEnact,
  votePower,
  voterState,
  snapshotBlock,
  startDate,
  isEnded,
}: Props) {
  const { data: symbol } = useGovernanceSymbol()

  const isMainPhase = status === VoteStatus.ActiveMain
  const isObjPhase = status === VoteStatus.ActiveObjection
  const isNotVoted = voterState === VoterState.NotVoted
  const isVotedYay = voterState === VoterState.VotedYay
  const isVotedNay = voterState === VoterState.VotedNay

  const elStartBlockDate = (
    <>
      (block {snapshotBlock} minted at{' '}
      <FormattedDate date={startDate} format="hh:mm A on DD of MMMM YYYY" />
      ).
    </>
  )

  const elThisWasYourBalance = (
    <>This was your balance when the vote started {elStartBlockDate}</>
  )

  const elChange = (
    <p>
      You can <b>change your vote</b> while the voting period is open but you
      can only vote <b>“No”</b> in the objection phase.
    </p>
  )

  const elNotVotedYet = (
    <>
      <p>
        Voting with{' '}
        <b>
          {votePower} {symbol}
        </b>
        . {elThisWasYourBalance}
      </p>
    </>
  )

  const elAlreadyVoted = (
    <>
      <p>
        You have voted <b>“{isVotedNay ? 'No' : 'Yes'}”</b> with{' '}
        <b>
          {votePower} {symbol}
        </b>
        . {elThisWasYourBalance}
      </p>
    </>
  )

  const elCantVote = (
    <p>
      You can not do vote because you had no <b>{symbol}</b> when the vote
      started {elStartBlockDate}.
    </p>
  )

  const elEnactText = (
    <p>
      The voting period is closed and the vote has passed.
      <br />
      Anyone can now enact this vote to execute its action.
    </p>
  )

  return (
    <Wrap>
      {isEnded === false && !canVote && Number(votePower) === 0 && elCantVote}
      {isEnded === false && canVote && isNotVoted && elNotVotedYet}
      {(isVotedYay || isVotedNay) && elAlreadyVoted}
      {canVote && (isMainPhase || (isObjPhase && isVotedYay)) && elChange}
      {canEnact && isEnded && elEnactText}
    </Wrap>
  )
}
