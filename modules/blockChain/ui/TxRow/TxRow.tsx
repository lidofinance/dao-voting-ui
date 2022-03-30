import { TransactionSender } from 'modules/blockChain/hooks/useTransactionSender'
import { TxHint, TxStatus } from './TxRowStyle'

export function TxRow({ label, tx }: { label: string; tx: TransactionSender }) {
  return (
    <TxHint>
      {label}
      <TxStatus status={tx.status} onClick={tx.open}>
        {tx.isPending && 'Pending...'}
        {tx.isSuccess && 'Confirmed (click to open)'}
        {tx.isFailed && 'Failed (click to see why)'}
      </TxStatus>
    </TxHint>
  )
}
