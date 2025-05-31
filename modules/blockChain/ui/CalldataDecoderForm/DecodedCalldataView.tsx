import {
  CalldataDecoder,
  DecodedCalldata,
} from 'modules/blockChain/CalldataDecoder'
import { useMemo, useState } from 'react'
import { TextBlock } from './TextBlock'
import { Option, Select, Text } from '@lidofinance/lido-ui'
import { SimulateTxForm } from './SimulateTxForm'
import { renderParams } from './utils'
import { BlockHeader, DecodedData } from './CalldataDecoderFormStyle'

type Props = {
  decodedCalldata: DecodedCalldata[]
  decoder: CalldataDecoder
  onSimulationError: (message: string) => void
}

export const DecodedCalldataView = ({
  decodedCalldata,
  decoder,
  onSimulationError,
}: Props) => {
  const [selectedDecodedMatchIndex, setSelectedDecodedMatchIndex] = useState(0)

  const matchedContracts = useMemo(() => {
    return decodedCalldata.map((match, index) => ({
      name: match.contractName,
      index,
    }))
  }, [decodedCalldata])

  if (!decodedCalldata.length) {
    return null
  }

  const selectedMatch = decodedCalldata[selectedDecodedMatchIndex]

  return (
    <>
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
            disabled={matchedContracts.length === 0}
          >
            {matchedContracts.map(contract => (
              <Option key={contract.index} value={contract.index}>
                {contract.name ?? 'Unknown contract'}
              </Option>
            ))}
          </Select>
        </TextBlock>
      )}
      <SimulateTxForm
        decoder={decoder}
        decodedCalldata={selectedMatch}
        onError={onSimulationError}
      />

      <DecodedData paddingLess>
        <BlockHeader>
          <Text size="sm">Decoded result</Text>
          <Text size="md">
            call <b>{selectedMatch.functionName}</b>
          </Text>
        </BlockHeader>
        <div>{renderParams(selectedMatch.params, decoder)}</div>
      </DecodedData>
    </>
  )
}
