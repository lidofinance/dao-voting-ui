import { Tooltip, PopoverPlacements } from '@lidofinance/lido-ui'

type Props = {
  placement?: PopoverPlacements
  children: React.ReactNode
}

export function VoteActionButtonObjectionTooltip({
  placement = 'bottomLeft',
  children,
}: Props) {
  return (
    <Tooltip
      placement={placement}
      title="You can only vote “No” in the Objection phase."
    >
      {/* Wrapped with div to make tooltip work properly with any children */}
      <div style={{ width: '100%' }}>{children}</div>
    </Tooltip>
  )
}
