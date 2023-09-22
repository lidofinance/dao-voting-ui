import { useCallback } from 'react'
import { Input } from '@lidofinance/lido-ui'
import { withFormController } from 'modules/shared/hocs/withFormController'

type InputProps = React.ComponentProps<typeof Input> & {
  isInteger?: boolean
}

export function InputNumber({
  value,
  isInteger,
  onChange,
  ...props
}: InputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let eventValue = e.currentTarget.value.trim()

      if (isNaN(Number(eventValue))) return

      if (isInteger) {
        if (eventValue.includes(',')) {
          eventValue = eventValue.replaceAll(',', '')
        }
        if (eventValue.includes('.')) {
          eventValue = eventValue.replaceAll('.', '')
        }
      } else {
        // Support for devices where inputMode="decimal" showing keyboard with comma as decimal delimiter
        if (eventValue.includes(',')) {
          eventValue = eventValue.replaceAll(',', '.')
        }

        // Prepend zero when user types just a dot symbol for "0."
        if (eventValue === '.') {
          eventValue = '0.'
        }
      }

      e.currentTarget.value = eventValue
      onChange?.(e)
    },
    [isInteger, onChange],
  )

  return <Input value={value} onChange={handleChange} {...props} />
}

export const InputControl = withFormController(Input)
