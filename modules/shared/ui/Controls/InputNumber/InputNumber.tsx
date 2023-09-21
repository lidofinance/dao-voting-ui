import { useCallback } from 'react'
import { Input } from '@lidofinance/lido-ui'
import { withFormController } from 'modules/shared/hocs/withFormController'

type InputProps = React.ComponentProps<typeof Input> & {
  isInteger?: boolean
}

export function InputNumber({ value, onChange, ...props }: InputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isNaN(Number(e.target.value))) return
      e.target.value = e.target.value.trim()
      onChange?.(e)
    },
    [onChange],
  )

  return <Input value={value} onChange={handleChange} {...props} />
}

export const InputControl = withFormController(Input)
