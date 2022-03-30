import type { ButtonProps } from '@lidofinance/lido-ui'
import { Wrap, Icon } from './ConnectButtonStyle'

export type Props = ButtonProps & {
  icon: React.ReactNode
}

export function ConnectButton(props: Props) {
  const { icon, children, ...rest } = props

  return (
    <Wrap {...rest}>
      <div>{children}</div>
      <Icon>{icon}</Icon>
    </Wrap>
  )
}
