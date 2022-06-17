import React from 'react'
import { Text } from 'modules/shared/ui/Common/Text'
import { Wrap, Body, Position } from './TooltipStyle'

type Props = {
  position?: Position
  tooltip?: React.ReactNode
  maxWidth?: number
  className?: string
  children?: React.ReactNode
}

export function Tooltip({
  position = 'top',
  tooltip,
  maxWidth,
  className,
  children,
}: Props) {
  return (
    <Wrap className={className}>
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
