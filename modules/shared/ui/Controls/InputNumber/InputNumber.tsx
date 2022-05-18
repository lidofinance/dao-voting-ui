import { useState, useCallback } from 'react'
import { Input } from '@lidofinance/lido-ui'
import { withFormController } from 'modules/shared/hocs/withFormController'

type InputProps = React.ComponentProps<typeof Input>

export function InputNumber({
  value: valueProp,
  onChange,
  ...props
}: InputProps) {
  const [valueState, setValue] = useState('')

  const value = valueProp !== undefined ? valueProp : valueState

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isNaN(Number(e.target.value))) {
        return
      }
      onChange?.(e)
      setValue(e.target.value)
    },
    [onChange],
  )

  return <Input value={value} onChange={handleChange} {...props} />
}

export const InputControl = withFormController(Input)
