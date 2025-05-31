import { Chip } from 'modules/shared/ui/Common/Chip'
import { VoteStatusWrap } from 'modules/votes/ui/VoteStatusChips/VoteStatusChipsStyle'
import InfoIcon from 'assets/info.com.svg.react'
import { VotePhase, VoteStatus } from '../../types'
import { VotePhasesTooltip } from 'modules/votes/ui/VotePhasesTooltip'
import { VoteQuorumStatusTooltip } from 'modules/votes/ui/VoteQuorumStatusTooltip'

interface Props {
  totalSupply: number
  minAcceptQuorum: number
  yeaNum: number
  nayNum: number
  status: VoteStatus
  executedTxHash?: string
  votePhase: VotePhase | undefined
}

const isQuorumReached = ({
  yeaNum,
  nayNum,
  totalSupply,
  minAcceptQuorum,
}: Props): boolean => {
  if (totalSupply === 0) {
    return false
  }

  const yeaQuorum = yeaNum / totalSupply
  const nayQuorum = nayNum / totalSupply

  return yeaQuorum > minAcceptQuorum || nayQuorum > minAcceptQuorum
}

const getWinningOption = (yeaNum: number, nayNum: number): 'Yes' | 'No' => {
  return yeaNum > nayNum ? 'Yes' : 'No'
}

export function VoteStatusChips({
  totalSupply,
  minAcceptQuorum,
  yeaNum,
  nayNum,
  status,
  executedTxHash,
  votePhase,
}: Props) {
  const quorumIsReached = isQuorumReached({
    yeaNum,
    nayNum,
    totalSupply,
    minAcceptQuorum,
    status,
    votePhase,
  })

  const minQuorumSupply = totalSupply * minAcceptQuorum

  let winningOptionChip = null
  if (yeaNum > 0 || nayNum > 0) {
    const winningOption = getWinningOption(yeaNum, nayNum)
    const winningVariant = winningOption === 'Yes' ? 'success' : 'danger'

    winningOptionChip = (
      <Chip variant={winningVariant}>Winning: {winningOption}</Chip>
    )
  }

  let statusChip = null
  if (status === VoteStatus.Passed) {
    statusChip = <Chip variant="success">Passed</Chip>
  } else if (status === VoteStatus.Executed) {
    statusChip = (
      <VotePhasesTooltip
        placement="bottomLeft"
        executedTxHash={executedTxHash}
        votePhase={votePhase}
      >
        <Chip variant="success">Passed (enacted)</Chip>
      </VotePhasesTooltip>
    )
  } else if (status === VoteStatus.Rejected && quorumIsReached) {
    statusChip = <Chip variant="danger">Rejected</Chip>
  }

  return (
    <VoteStatusWrap data-testid="voteStatus">
      {votePhase === VotePhase.Closed && statusChip}

      {votePhase !== VotePhase.Closed && winningOptionChip}
      <VoteQuorumStatusTooltip
        minQuorumSupply={minQuorumSupply}
        totalSupply={totalSupply}
        placement="bottomLeft"
      >
        {votePhase === VotePhase.Closed ? (
          !quorumIsReached && (
            <Chip variant="warning">
              No quorum <InfoIcon />
            </Chip>
          )
        ) : quorumIsReached ? (
          <Chip variant="success">
            Quorum reached <InfoIcon />
          </Chip>
        ) : (
          <Chip variant="warning">
            No quorum <InfoIcon />
          </Chip>
        )}
      </VoteQuorumStatusTooltip>
    </VoteStatusWrap>
  )
}
