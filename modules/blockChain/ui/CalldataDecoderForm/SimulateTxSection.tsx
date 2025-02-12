import { Button, Input, Text } from '@lidofinance/lido-ui'
import { isAddress } from 'ethers/lib/utils'
import {
  CalldataDecoder,
  DecodedCalldata,
} from 'modules/blockChain/CalldataDecoder'
import { ChangeEventHandler, useCallback, useState } from 'react'
import { TextBlock } from './TextBlock'

type Props = {
  decoder: CalldataDecoder
  selectedMatch: DecodedCalldata
  onError: (message: string) => void
}

export const SimulateTxSection = ({
  decoder,
  selectedMatch,
  onError,
}: Props) => {
  const [fromAddress, setFromAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [inputError, setInputError] = useState<string | undefined>()
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    if (!isAddress(e.target.value)) {
      setInputError('Invalid address')
      return
    }
    setFromAddress(e.target.value)
  }, [])

  const handleSimulate = useCallback(async () => {
    setIsLoading(true)
    setIsSuccess(false)
    const simulationResult = await decoder.simulateTransaction(selectedMatch)
    if (simulationResult.error) {
      onError(`Simulation error: ${simulationResult.error.reason}`)
    }
    setIsLoading(false)
  }, [decoder, selectedMatch, onError])

  return (
    <TextBlock>
      <Text size="sm">Simulate transaction</Text>
      <Input
        label="from"
        placeholder="0x..."
        value={fromAddress}
        onChange={handleChange}
        error={inputError}
      />
      <Button variant="outlined" onClick={handleSimulate} loading={isLoading}>
        Simulate
      </Button>
      {isSuccess && <Text color="success">Success</Text>}
    </TextBlock>
  )
}
