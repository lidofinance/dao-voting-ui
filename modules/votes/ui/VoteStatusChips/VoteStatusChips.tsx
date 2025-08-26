import { Chip } from 'modules/shared/ui/Common/Chip'
import { VoteStatusWrap } from 'modules/votes/ui/VoteStatusChips/VoteStatusChipsStyle'
import InfoIcon from 'assets/info.com.svg.react'
import { VotePhase, VoteStatus } from '../../types'
import { VotePhasesTooltip } from 'modules/votes/ui/VotePhasesTooltip'
import { VoteQuorumStatusTooltip } from 'modules/votes/ui/VoteQuorumStatusTooltip'
import { ProposalStatus } from 'modules/dual-governance/types'
import { External, Link, Tooltip } from '@lidofinance/lido-ui'
import {
  LinkWrap,
  TooltipText,
} from '../VotePhasesTooltip/VotePhasesTooltipStyle'
import { getDualGovernanceLink } from 'modules/dual-governance/utils'
import { CHAINS } from '@lido-sdk/constants'

interface Props {
  totalSupply: number
  minAcceptQuorum: number
  yeaNum: number
  nayNum: number
  status: VoteStatus
  executedTxHash?: string
  votePhase: VotePhase | undefined
  voteDualGovernanceStatus: ProposalStatus | null
  proposalId: number | null
  chainId: CHAINS
}

const isQuorumReached = ({
  yeaNum,
  nayNum,
  totalSupply,
  minAcceptQuorum,
}: Omit<
  Props,
  'voteDualGovernanceStatus' | 'chainId' | 'proposalId'
>): boolean => {
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
  voteDualGovernanceStatus,
  chainId,
  proposalId,
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

  switch (status) {
    case VoteStatus.Passed:
      statusChip = <Chip variant="success">Passed</Chip>
      break
    case VoteStatus.Pending:
      statusChip = <Chip variant="success">Passed (pending)</Chip>
      break
    case VoteStatus.Rejected:
      if (quorumIsReached) {
        statusChip = <Chip variant="danger">Rejected</Chip>
      }
      break
    case VoteStatus.Executed:
      if (
        voteDualGovernanceStatus === null ||
        voteDualGovernanceStatus === ProposalStatus.Executed
      ) {
        statusChip = (
          <VotePhasesTooltip
            placement="bottomLeft"
            executedTxHash={executedTxHash}
            votePhase={votePhase}
          >
            <Chip variant="success">Passed (enacted)</Chip>
          </VotePhasesTooltip>
        )
        break
      }

      if (voteDualGovernanceStatus === ProposalStatus.Cancelled) {
        statusChip = (
          <Tooltip
            title={
              <TooltipText>
                <LinkWrap>
                  See on Dual Governance:
                  <Link
                    href={`${getDualGovernanceLink(
                      chainId,
                    )}proposals/${proposalId}`}
                  >
                    <External />
                  </Link>
                </LinkWrap>
              </TooltipText>
            }
          >
            <div>
              <Chip variant="warning">Cancelled in Dual Governance</Chip>
            </div>
          </Tooltip>
        )
        break
      }

      statusChip = (
        <Tooltip
          title={
            <TooltipText>
              <LinkWrap>
                See on Dual Governance
                <Link
                  href={`${getDualGovernanceLink(
                    chainId,
                  )}proposals/${proposalId}`}
                >
                  <External />
                </Link>
              </LinkWrap>
            </TooltipText>
          }
        >
          <div>
            <Chip variant="warning">In Dual Governance review</Chip>
          </div>
        </Tooltip>
      )
      break
    default:
      statusChip = null
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
