import { SwitchItem } from './SwitchItem'
import { SwitchWrapper, Highlight } from './SwitchStyle'

type Props = {
  checked: boolean
  routes: { name: string; path: string }[]
}

export const Switch = (props: Props) => {
  const { checked, routes } = props

  return (
    <SwitchWrapper>
      <Highlight $checked={checked} />
      <SwitchItem href={routes[0].path}>{routes[0].name}</SwitchItem>
      <SwitchItem href={routes[1].path}>{routes[1].name}</SwitchItem>
    </SwitchWrapper>
  )
}
