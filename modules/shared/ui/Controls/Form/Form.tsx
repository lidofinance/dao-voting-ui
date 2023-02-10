import {
  FormProvider,
  UseFormReturn,
  FieldValues,
  UseFormHandleSubmit,
} from 'react-hook-form'

type Props<TFieldValues extends FieldValues> = {
  formMethods: UseFormReturn<TFieldValues>
  onSubmit: Parameters<UseFormHandleSubmit<TFieldValues>>[0]
  className?: string
  children?: React.ReactNode
}

export function Form<TFieldValues extends FieldValues>({
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
