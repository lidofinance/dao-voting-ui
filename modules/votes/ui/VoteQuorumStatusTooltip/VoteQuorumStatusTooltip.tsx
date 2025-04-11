import { Tooltip, PopoverPlacements } from '@lidofinance/lido-ui'

import { TooltipText } from 'modules/votes/ui/VoteQuorumStatusTooltip/VoteQuorumStatusTooltipStyle'
import { useGovernanceTokenData } from 'modules/tokens/hooks/useGovernanceTokenData'

type Props = {
  placement: PopoverPlacements
  totalSupply: number
  minQuorumSupply: number
  children: React.ReactNode
}

export function VoteQuorumStatusTooltip({
  placement = 'bottomLeft',
  totalSupply,
  minQuorumSupply,
  children,
}: Props) {
  const { data: tokenData } = useGovernanceTokenData()

  return (
    <Tooltip
      placement={placement}
      title={
        <TooltipText>
          To reach quorum, more than 5% of the total {tokenData?.symbol} supply
          must vote for one option.
          <br />
          Total Supply: {totalSupply.toLocaleString()}
          <br />
          Quorum: {minQuorumSupply.toLocaleString()}
        </TooltipText>
      }
    >
      {/* Wrapped with div to make tooltip work properly with any children */}
      <div>{children}</div>
    </Tooltip>
  )
}
