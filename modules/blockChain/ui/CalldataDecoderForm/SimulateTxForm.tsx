import { Button, Text } from '@lidofinance/lido-ui'
import {
  CalldataDecoder,
  DecodedCalldata,
} from 'modules/blockChain/CalldataDecoder'
import { useCallback, useEffect, useState } from 'react'
import { TextBlock } from './TextBlock'
import { useForm } from 'react-hook-form'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { Form } from 'modules/shared/ui/Controls/Form'
import { validateAddress } from 'modules/delegation/utils/validateAddress'
import { BigNumber } from 'ethers'

type FormValues = {
  from?: string
  to: string
  value?: string
}

type Props = {
  decoder: CalldataDecoder
  decodedCalldata: DecodedCalldata
  onError: (message: string) => void
}

export const SimulateTxForm = ({
  decoder,
  decodedCalldata,
  onError,
}: Props) => {
  const [isSuccess, setIsSuccess] = useState(false)

  const formMethods = useForm<FormValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      to: decodedCalldata.contractAddress,
      from: '',
      value: '',
      // value: selectedMatch.params.value.toString(),
    },
  })

  const {
    formState: { isSubmitting },
    setValue,
    getValues,
  } = formMethods

  // Reset form state on props change
  useEffect(() => {
    if (isSuccess) {
      setIsSuccess(false)
    }
    if (
      getValues('to').toLowerCase() !==
      decodedCalldata.contractAddress.toLowerCase()
    ) {
      setValue('to', decodedCalldata.contractAddress, {
        shouldValidate: true,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decodedCalldata])

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      setIsSuccess(false)

      const simulationResult = await decoder.simulateTransaction({
        ...values,
        decodedCalldata,
      })
      if (simulationResult.error) {
        onError(`Simulation error: ${simulationResult.error.reason}`)
        return
      }
      setIsSuccess(true)
    },
    [decoder, decodedCalldata, onError],
  )

  return (
    <Form formMethods={formMethods} onSubmit={handleSubmit}>
      <TextBlock>
        <Text size="sm">Simulate transaction</Text>
        <InputControl
          label="to"
          placeholder="0x..."
          name="to"
          rules={{ validate: validateAddress }}
        />
        <InputControl
          label="from (optional)"
          placeholder="0x..."
          name="from"
          rules={{
            validate: value => {
              if (!value) return true
              const addressErr = validateAddress(value)
              if (addressErr) {
                return addressErr
              }
              return true
            },
          }}
        />
        <InputControl
          label="value in wei (optional)"
          placeholder="0"
          name="value"
          rules={{
            validate: value => {
              if (!value) return true
              try {
                BigNumber.from(value)
              } catch (error) {
                return 'Invalid value'
              }
            },
          }}
        />

        <Button type="submit" variant="outlined" loading={isSubmitting}>
          Simulate
        </Button>
        {isSuccess && (
          <Text color="success">The transaction simulation was successful</Text>
        )}
      </TextBlock>
    </Form>
  )
}
