import { Block, Button, Text, Textarea } from '@lidofinance/lido-ui'
import {
  DecodedCalldata,
  CalldataParams,
  CalldataDecoder,
} from 'modules/blockChain/CalldataDecoder'
import { useCalldataDecoder } from 'modules/blockChain/hooks/useCalldataDecoder'
import { useCallback, useState } from 'react'
import {
  BlockHeader,
  DecodedData,
  KeyValue,
  NestedBlock,
  Wrapper,
} from './CalldataDecoderFormStyle'
import { ethers } from 'ethers'
import { formatToken } from 'modules/tokens/utils/formatToken'

const renderParams = (params: CalldataParams, decoder: CalldataDecoder) => {
  return Object.keys(params).map(key => {
    if (isNaN(Number(key))) {
      const param = params[key]

      const keyElement = (
        <Text weight={500} size="xxs">
          {key}
        </Text>
      )

      if (ethers.BigNumber.isBigNumber(param)) {
        return (
          <KeyValue key={key}>
            {keyElement}
            <Text size="xxs" weight={600}>
              {formatToken(param, 'ETH')}
            </Text>
          </KeyValue>
        )
      }

      if (Array.isArray(param)) {
        return (
          <NestedBlock>
            {keyElement}
            {param.map((p, i) => (
              <NestedBlock key={i}>
                <Text size="xxs">calls[{i}]</Text>
                {renderParams(p, decoder)}
              </NestedBlock>
            ))}
          </NestedBlock>
        )
      }

      if (typeof param === 'number') {
        return (
          <KeyValue key={key}>
            {keyElement}
            <Text size="xxs" weight={600}>
              {param}
            </Text>
          </KeyValue>
        )
      }

      if (param.startsWith('0x')) {
        const decoded = decoder.decode(param)
        if (decoded) {
          return (
            <NestedBlock key={key}>
              {keyElement}
              {renderParams(decoded.params, decoder)}
            </NestedBlock>
          )
        }
      }

      return (
        <KeyValue key={key}>
          {keyElement}
          <Text size="xxs" weight={600}>
            {param}
          </Text>
        </KeyValue>
      )
    }
  })
}

export const CalldataDecoderForm = () => {
  const [calldata, setCalldata] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [decodedData, setDecodedData] = useState<DecodedCalldata>()

  const decoder = useCalldataDecoder()

  const handleDecode = useCallback(() => {
    setIsLoading(true)
    setErrorMessage(undefined)
    const decoded = decoder.decode(calldata)
    if (!decoded) {
      setErrorMessage('Failed to decode calldata')
    } else {
      setDecodedData(decoded)
    }
    setIsLoading(false)
    try {
    } catch (error: any) {
      setErrorMessage(error.message)
    }
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
        <Block>
          <Text color="error">Error: {errorMessage}</Text>
        </Block>
      )}
      {!!decodedData && (
        <DecodedData>
          <BlockHeader>
            <Text size="xl" weight={600}>
              on [{decodedData.contractName}]
            </Text>
            <Text size="md">
              call <b>{decodedData.functionName}</b>
            </Text>
          </BlockHeader>
          <div>{renderParams(decodedData.params, decoder)}</div>
        </DecodedData>
      )}
    </Wrapper>
  )
}
