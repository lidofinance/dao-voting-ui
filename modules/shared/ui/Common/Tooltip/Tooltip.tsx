import React from 'react'
import { Text } from 'modules/shared/ui/Common/Text'
import { Wrap, Body, Position } from './TooltipStyle'

export type { Position } from './TooltipStyle'

type Props = {
  position?: Position
  tooltip?: React.ReactNode
  maxWidth?: number
  fitContent?: boolean
  className?: string
  children?: React.ReactNode
}

export function Tooltip({
  position = 'top',
  tooltip,
  maxWidth,
  fitContent,
  className,
  children,
}: Props) {
  return (
    <Wrap fitContent={fitContent} className={className}>
      {children}
      <Body position={position} style={{ maxWidth }}>
        <Text
          size={12}
          weight={500}
          color="primaryContrast"
          children={tooltip}
        />
      </Body>
    </Wrap>
  )
}
