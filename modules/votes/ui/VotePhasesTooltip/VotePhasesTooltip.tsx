import { Tooltip, Position } from 'modules/shared/ui/Common/Tooltip'

type Props = {
  position: Position
  className?: string
  children: React.ReactNode
}

export function VotePhasesTooltip({ position, className, children }: Props) {
  return (
    <Tooltip
      position={position}
      maxWidth={360}
      className={className}
      tooltip={
        <>
          Each voting comes in two phases.
          <br />
          In the first phase (or&nbsp;Main&nbsp;phase), participants can either
          vote pro or contra, whereas in the second phase only objections can be
          submitted.
        </>
      }
    >
      {children}
    </Tooltip>
  )
}
