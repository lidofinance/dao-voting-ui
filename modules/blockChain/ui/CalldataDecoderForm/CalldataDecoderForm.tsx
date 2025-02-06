import { Button, Text, Textarea } from '@lidofinance/lido-ui'
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
  const [calldata, setCalldata] = useState(
    '0x53e51f8b000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000005a0000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000003c000000000000000000000000000000000000000000000000000000000000004800000000000000000000000009404fc6f57b32a01f4f8770f06b399c753519fc3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000024ab033ea9000000000000000000000000b291a7f092d5cce0a3c93ea21bda3431129db202000000000000000000000000000000000000000000000000000000000000000000000000000000009404fc6f57b32a01f4f8770f06b399c753519fc30000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000245a728b450000000000000000000000003b20930b143f21c4a837a837cbbcd15ac0b93504000000000000000000000000000000000000000000000000000000000000000000000000000000009404fc6f57b32a01f4f8770f06b399c753519fc3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000024248946010000000000000000000000008da88a400500955e17fab806de606b025d033c66000000000000000000000000000000000000000000000000000000000000000000000000000000009404fc6f57b32a01f4f8770f06b399c753519fc3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000024ddb2408a0000000000000000000000007bad309e8f1501c71f33dbbc843a462dabf6eb22000000000000000000000000000000000000000000000000000000000000000000000000000000009404fc6f57b32a01f4f8770f06b399c753519fc3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000024a211a396000000000000000000000000000000000000000000000000000000006955b900000000000000000000000000000000000000000000000000000000000000000000000000000000009404fc6f57b32a01f4f8770f06b399c753519fc3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000024be1d6dd30000000000000000000000000000000000000000000000000000000000015180000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000036526573657420656d657267656e6379206d6f646520616e6420736574206f726967696e616c20444720617320676f7665726e616e636500000000000000000000',
  )
  const [errorMessage, setErrorMessage] = useState<string>()
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
      {errorMessage && <div>{errorMessage}</div>}
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
