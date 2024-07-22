import { FC, ReactNode } from 'react'
import { useCompareWithRouterPath } from 'modules/shared/hooks/useCompareWithRouterPath'
import { SwitchItemStyled } from './SwitchStyle'

type ComponentProps<
  T extends keyof JSX.IntrinsicElements,
  P extends Record<string, unknown> = { children?: ReactNode },
> = Omit<JSX.IntrinsicElements[T], 'key' | keyof P> & P

type Component<
  T extends keyof JSX.IntrinsicElements,
  P extends Record<string, unknown> = { children?: ReactNode },
> = FC<ComponentProps<T, P>>

export const SwitchItem: Component<'a'> = props => {
  const { href, ...rest } = props
  const active = useCompareWithRouterPath(href ?? '')

  return <SwitchItemStyled href={href ?? ''} $active={active} {...rest} />
}
