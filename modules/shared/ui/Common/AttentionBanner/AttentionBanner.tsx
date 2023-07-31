import { Wrap } from './AttentionBannerStyle'
import DangerIconSVG from 'assets/danger.com.svg.react'

type Props = {
  type?: 'error' | 'warning'
  children?: React.ReactNode
}

export const AttentionBanner = ({ type = 'warning', children }: Props) => {
  return (
    <Wrap type={type}>
      <DangerIconSVG />
      <span>{children}</span>
    </Wrap>
  )
}
