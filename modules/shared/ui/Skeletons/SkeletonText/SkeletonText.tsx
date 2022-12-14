import { SkeletonBar } from '../SkeletonBar'
import { Wrap } from './SkeletonTextStyle'

type Props = {
  size: number
  width: number | string
  lineHeight?: number
  className?: string
  style?: React.CSSProperties
  showOnBackground?: boolean
}

export function SkeletonText({
  size = 15,
  lineHeight = 1.25,
  width,
  className,
  style,
  showOnBackground,
}: Props) {
  return (
    <Wrap
      style={{ ...style, width, height: size * lineHeight, fontSize: size }}
      className={className}
    >
      <SkeletonBar
        width="100%"
        style={{ height: '1em' }}
        showOnBackground={showOnBackground}
      />
    </Wrap>
  )
}
