import styled from 'styled-components'
import { Text } from 'modules/shared/ui/Common/Text'
import { TxStatus as TxStatusType } from 'modules/blockChain/types'

export const Hint = styled(Text).attrs({
  size: 12,
  weight: 500,
})`
  font-size: 14px;
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
  margin-left: 4px;
  font-weight: 800;
  cursor: pointer;
  color: ${({ status, theme }) =>
    status === 'pending'
      ? theme.colors.primary
      : status === 'success'
      ? theme.colors.success
      : theme.colors.error};
`
