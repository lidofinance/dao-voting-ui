import { forwardRef } from 'react'

export const mapPropsWithRef =
  <Own, Mapped>(mapper: (p: Mapped) => Own) =>
  (Wrapped: React.ComponentType<Own>) =>
    forwardRef(function Mapped(
      props: Mapped,
      ref: React.Ref<React.ElementRef<typeof Wrapped>>,
    ) {
      return <Wrapped ref={ref} {...mapper(props)} />
    })
