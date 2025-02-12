import { Text } from '@lidofinance/lido-ui'
import { BigNumber } from 'ethers'
import {
  CalldataDecoder,
  CalldataParams,
} from 'modules/blockChain/CalldataDecoder'
import { KeyValue, NestedBlock } from './CalldataDecoderFormStyle'
import { formatToken } from 'modules/tokens/utils/formatToken'

export const renderParams = (
  params: CalldataParams,
  decoder: CalldataDecoder,
) => {
  return Object.keys(params).map(key => {
    if (isNaN(Number(key))) {
      const param = params[key]

      const keyElement = (
        <Text weight={500} size="xxs">
          {key}
        </Text>
      )

      if (BigNumber.isBigNumber(param)) {
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
          <NestedBlock key={key}>
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
        const matches = decoder.decode(param)
        if (matches.length) {
          const decoded = matches[0]
          return (
            <NestedBlock key={key}>
              {keyElement}
              <Text color="secondary" size="xxs" weight={600}>
                call {decoded.functionName} on {decoded.contractName}
              </Text>
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
