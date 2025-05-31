import { Button, Text, Textarea } from '@lidofinance/lido-ui'
import { DecodedCalldata } from 'modules/blockChain/CalldataDecoder'
import { useCalldataDecoder } from 'modules/blockChain/hooks/useCalldataDecoder'
import { useCallback, useEffect, useState } from 'react'
import { DecodedData, Wrapper } from './CalldataDecoderFormStyle'
import { TextBlock } from './TextBlock'
import { VoteScript } from 'modules/votes/ui/VoteScript'
import { DecodedCalldataView } from './DecodedCalldataView'

type DecodingResult =
  | {
      isEvmScript: true
    }
  | {
      isEvmScript: false
      decoded: DecodedCalldata[]
    }

export const CalldataDecoderForm = () => {
  const [calldata, setCalldata] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [decodingResult, setDecodingResult] = useState<DecodingResult>()

  const decoder = useCalldataDecoder()

  useEffect(() => {
    if (!!decodingResult) {
      setDecodingResult(undefined)
      setErrorMessage(undefined)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calldata])

  const handleDecode = useCallback(() => {
    setIsLoading(true)
    setErrorMessage(undefined)
    if (calldata.startsWith('0x00000001')) {
      setDecodingResult({ isEvmScript: true })
    } else {
      const decoded = decoder.decode(calldata)
      if (!decoded.length) {
        setErrorMessage('Failed to decode calldata')
      } else {
        setDecodingResult({ isEvmScript: false, decoded })
      }
    }

    setIsLoading(false)
  }, [calldata, decoder])

  return (
    <Wrapper>
      <Textarea
        placeholder="0x..."
        label="Encoded calldata"
        value={calldata}
        onChange={e => setCalldata(e.target.value)}
        style={{ height: 200 }}
      />
      <Button onClick={handleDecode} loading={isLoading}>
        Decode
      </Button>
      {errorMessage && (
        <TextBlock>
          <Text color="error" size="md">
            {errorMessage}
          </Text>
        </TextBlock>
      )}

      {!!decodingResult && (
        <>
          {decodingResult.isEvmScript ? (
            <DecodedData paddingLess>
              <VoteScript script={calldata} />
            </DecodedData>
          ) : (
            <DecodedCalldataView
              decodedCalldata={decodingResult.decoded}
              decoder={decoder}
              onSimulationError={setErrorMessage}
            />
          )}
        </>
      )}
    </Wrapper>
  )
}
