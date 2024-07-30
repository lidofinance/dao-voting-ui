import { TransactionSender } from 'modules/blockChain/hooks/useTransactionSender'
import { TxStatusBadge } from 'modules/delegation/ui/TxStatusBadge'
import { TxStatus } from 'modules/blockChain/ui/TxRow/TxRowStyle'

export function TxRow({
  tx,
  onClick,
}: {
  tx: TransactionSender
  onClick?: () => void
}) {
  return (
    <TxStatus>
      <TxStatusBadge onClick={onClick} status={tx.status} type={tx.tx?.type} />
    </TxStatus>
  )
}
