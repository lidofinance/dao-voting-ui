import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import { Text } from 'modules/shared/ui/Common/Text'
import { Tooltip, PopoverPlacements, Link } from '@lidofinance/lido-ui'

import { getEtherscanTxLink } from '@lido-sdk/helpers'

type Props = {
  placement: PopoverPlacements
  children: React.ReactNode
  executedTxHash?: string
}

export function VotePhasesTooltip({
  placement = 'bottomLeft',
  executedTxHash,
  children,
}: Props) {
  const { chainId } = useWeb3()
  return (
    <Tooltip
      placement={placement}
      title={
        <Text size={12} color="contrast" weight={400}>
          Each voting comes in two phases.
          <br />
          In the first phase (or&nbsp;Main&nbsp;phase), participants can either
          vote pro or contra, whereas in the second phase only objections can be
          submitted.
          {executedTxHash && (
            <>
              <br />
              <Link href={getEtherscanTxLink(chainId, executedTxHash)}>
                Executed
              </Link>
            </>
          )}
        </Text>
      }
    >
      {/* Wrapped with div to make tooltip work properly with any children */}
      <div>{children}</div>
    </Tooltip>
  )
}
