import { ChipWrap } from './ChipStyle'
import { ChipVariant } from './types'

interface Props {
  children?: any
  variant: ChipVariant
}

export function Chip({ children, variant }: Props) {
  return <ChipWrap $variant={variant}>{children}</ChipWrap>
}
