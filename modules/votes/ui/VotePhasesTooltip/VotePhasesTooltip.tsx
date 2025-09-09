import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import {
  Tooltip,
  PopoverPlacements,
  Link,
  External,
} from '@lidofinance/lido-ui'
import { TooltipText, LinkWrap } from './VotePhasesTooltipStyle'

import { getEtherscanTxLink } from 'modules/blockChain/utils/getEtherscanLink'
import { VotePhase } from 'modules/votes/types'

type Props = {
  placement: PopoverPlacements
  children: React.ReactNode
  executedTxHash?: string
  votePhase?: VotePhase
}

export function VotePhasesTooltip({
  placement = 'bottomLeft',
  executedTxHash,
  children,
  votePhase,
}: Props) {
  const { chainId } = useWeb3()
  return (
    <Tooltip
      placement={placement}
      title={
        <TooltipText>
          {votePhase !== VotePhase.Closed && (
            <>
              Each voting comes in two phases.
              <br />
              In the first phase (or&nbsp;Main&nbsp;phase), participants can
              either vote pro or contra, whereas in the second phase only
              objections can be submitted.
            </>
          )}
          {executedTxHash && (
            <LinkWrap>
              Executed. See on Etherscan:
              <Link href={getEtherscanTxLink(chainId, executedTxHash)}>
                <External />
              </Link>
            </LinkWrap>
          )}
        </TooltipText>
      }
    >
      {/* Wrapped with div to make tooltip work properly with any children */}
      <div>{children}</div>
    </Tooltip>
  )
}
