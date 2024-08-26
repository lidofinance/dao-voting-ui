import { FC, ReactNode } from 'react'

type ComponentProps<
  T extends keyof JSX.IntrinsicElements,
  P extends Record<string, unknown> = { children?: ReactNode },
> = Omit<JSX.IntrinsicElements[T], 'key' | keyof P> & P

type Component<
  T extends keyof JSX.IntrinsicElements,
  P extends Record<string, unknown> = { children?: ReactNode },
> = FC<ComponentProps<T, P>>

export type SwitchItemComponent = Component<'a'>
