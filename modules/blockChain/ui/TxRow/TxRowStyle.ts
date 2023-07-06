import styled from 'styled-components'
import { Text } from '@lidofinance/lido-ui'
import { TxStatus as TxStatusType } from 'modules/blockChain/types'

export const Hint = styled(Text).attrs({
  size: 'xxs',
  weight: 500,
})`
  margin-bottom: 10px;
  opacity: 0.8;
`

export const TxHint = styled(Hint)`
  display: flex;
  align-items: flex-end;
`

type TxStatusProps = {
  status: TxStatusType
}
export const TxStatus = styled.span<TxStatusProps>`
  margin-left: ${({ theme }) => theme.spaceMap.xs}px;
  font-weight: 800;
  cursor: pointer;
  color: ${({ status }) =>
    status === 'pending'
      ? 'var(--lido-color-primary)'
      : status === 'success'
      ? 'var(--lido-color-success)'
      : 'var(--lido-color-error)'};
`
