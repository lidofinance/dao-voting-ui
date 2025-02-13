import { Text } from '@lidofinance/lido-ui'
import React from 'react'
import { TextBlockStyled } from './CalldataDecoderFormStyle'

type Props = {
  children: React.ReactNode
}

export const TextBlock: React.FC<Props> = ({ children }) => {
  return (
    <TextBlockStyled>
      {typeof children === 'string' ? (
        <Text size="sm">{children}</Text>
      ) : (
        children
      )}
    </TextBlockStyled>
  )
}
