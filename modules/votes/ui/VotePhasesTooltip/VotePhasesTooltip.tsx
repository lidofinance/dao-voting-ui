import { Text } from 'modules/shared/ui/Common/Text'
import { Tooltip, PopoverPlacements } from '@lidofinance/lido-ui'

type Props = {
  placement: PopoverPlacements
  children: React.ReactNode
}

export function VotePhasesTooltip({
  placement = 'bottomLeft',
  children,
}: Props) {
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
        </Text>
      }
    >
      {/* Wrapped with div to make tooltip work properly with any children */}
      <div>{children}</div>
    </Tooltip>
  )
}
