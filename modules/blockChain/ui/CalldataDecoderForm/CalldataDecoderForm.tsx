import { Button, Select, Text, Textarea, Option } from '@lidofinance/lido-ui'
import { DecodedCalldata } from 'modules/blockChain/CalldataDecoder'
import { useCalldataDecoder } from 'modules/blockChain/hooks/useCalldataDecoder'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { BlockHeader, DecodedData, Wrapper } from './CalldataDecoderFormStyle'
import { TextBlock } from './TextBlock'
import { SimulateTxForm } from './SimulateTxForm'
import { renderParams } from './utils'

export const CalldataDecoderForm = () => {
  const [calldata, setCalldata] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [decodedMatches, setDecodedMatches] = useState<DecodedCalldata[]>()
  const [selectedDecodedMatchIndex, setSelectedDecodedMatchIndex] = useState(0)

  const selectedMatch = decodedMatches?.[selectedDecodedMatchIndex]

  const decoder = useCalldataDecoder()

  useEffect(() => {
    if (decodedMatches?.length) {
      setDecodedMatches(undefined)
      setSelectedDecodedMatchIndex(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calldata])

  const handleDecode = useCallback(() => {
    setIsLoading(true)
    setErrorMessage(undefined)
    const decoded = decoder.decode(calldata)
    if (!decoded.length) {
      setErrorMessage('Failed to decode calldata')
    } else {
      setDecodedMatches(decoded)
    }
    setIsLoading(false)
    try {
    } catch (error: any) {
      setErrorMessage(error.message)
    }
  }, [calldata, decoder])

  const matchedContracts = useMemo(() => {
    if (!decodedMatches) {
      return []
    }

    return decodedMatches.map((match, index) => ({
      name: match.contractName,
      index,
    }))
  }, [decodedMatches])

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
      {matchedContracts.length > 0 && (
        <TextBlock>
          <Text size="sm">
            Found {matchedContracts.length} contract match
            {matchedContracts.length > 1 ? 'es' : ''} by ABI
          </Text>
          <Select
            label="Matched contract"
            value={selectedDecodedMatchIndex}
            onChange={value => setSelectedDecodedMatchIndex(value as number)}
            disabled={matchedContracts.length === 0 || isLoading}
          >
            {matchedContracts.map(contract => (
              <Option key={contract.index} value={contract.index}>
                {contract.name ?? 'Unknown contract'}
              </Option>
            ))}
          </Select>
        </TextBlock>
      )}
      {!!selectedMatch && (
        <SimulateTxForm
          decoder={decoder}
          decodedCalldata={selectedMatch}
          onError={setErrorMessage}
        />
      )}
      {errorMessage && (
        <TextBlock>
          <Text color="error" size="md">
            {errorMessage}
          </Text>
        </TextBlock>
      )}

      {!!selectedMatch && (
        <DecodedData paddingLess>
          <BlockHeader>
            <Text size="sm">Decoded result</Text>
            <Text size="md">
              call <b>{selectedMatch.functionName}</b>
            </Text>
          </BlockHeader>
          <div>{renderParams(selectedMatch.params, decoder)}</div>
        </DecodedData>
      )}
    </Wrapper>
  )
}
