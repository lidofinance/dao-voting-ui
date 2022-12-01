import { Bar } from './SkeletonBarStyle'

type Props = {
  width?: number | string
  className?: string
  style?: React.CSSProperties
  showOnBackground?: boolean
}

export function SkeletonBar({
  width,
  className,
  style = {},
  showOnBackground,
}: Props) {
  return (
    <Bar
      style={{ ...style, width }}
      showOnBackground={showOnBackground}
      className={className}
    />
  )
}
