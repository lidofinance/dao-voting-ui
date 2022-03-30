import {
  FormProvider,
  UseFormReturn,
  UseFormHandleSubmit,
} from 'react-hook-form'

type Props<TFieldValues> = {
  formMethods: UseFormReturn<TFieldValues>
  onSubmit: Parameters<UseFormHandleSubmit<TFieldValues>>[0]
  className?: string
  children?: React.ReactNode
}

export function Form<TFieldValues>({
  formMethods,
  onSubmit,
  className,
  children,
}: Props<TFieldValues>) {
  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className={className}
        children={children}
      />
    </FormProvider>
  )
}
