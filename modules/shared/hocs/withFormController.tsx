import React from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import type { Subtract } from 'utility-types'

type ControllerProps = React.ComponentProps<typeof Controller>
type Rules = ControllerProps['rules']

type WrapperProps = {
  name: string
  rules?: Rules
}

type InjectedProps = {
  name?: string
  value?: any
  error?: React.ReactNode
  onBlur?: React.FocusEventHandler
  onChange?: (e: any) => void
}

export function withFormController<Props extends InjectedProps>(
  Control: React.ComponentType<Props>,
) {
  type WrappedProps = Subtract<Props, InjectedProps> & WrapperProps

  function FormController(props: WrappedProps) {
    const { name, rules, ...restProps } = props
    const { control } = useFormContext()

    return (
      <Controller
        name={name}
        rules={rules}
        control={control}
        render={args => (
          <Control
            {...(restProps as any)}
            ref={args.field.ref}
            name={args.field.name}
            value={args.field.value}
            onBlur={args.field.onBlur}
            onChange={args.field.onChange}
            error={args.fieldState.error?.message}
          />
        )}
      />
    )
  }

  return FormController as React.ComponentType<WrappedProps>
}
