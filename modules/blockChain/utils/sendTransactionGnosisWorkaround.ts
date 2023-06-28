import { PopulatedTransaction } from '@ethersproject/contracts'
import { ToastInfo, toast } from '@lidofinance/lido-ui'
import { ResultTx } from '../types'
import type { Signer } from '@ethersproject/abstract-signer'
import type { JsonRpcSigner } from '@ethersproject/providers'

// This workaround exists because gnosis safe return making regular `sendTransaction` endlessly waiting
// https://github.com/ethers-io/ethers.js/blob/7274cd06cf3f6f31c6df3fd6636706d8536b7ee2/packages/providers/src.ts/json-rpc-provider.ts#L226-L246

export async function sendTransactionGnosisWorkaround(
  signer: Signer | JsonRpcSigner | undefined,
  transaction: PopulatedTransaction,
  isMultisig: boolean,
): Promise<ResultTx> {
  if (!signer) throw Error('signer is required')

  const pendingToastId = ToastInfo(`Confirm transaction in your wallet`, {})

  if (isMultisig) {
    const hash: string = await (signer as any).sendUncheckedTransaction(
      transaction,
    )
    return {
      type: 'safe',
      tx: { safeTxHash: hash },
    }
  }

  const tx = await signer.sendTransaction(transaction)

  toast.dismiss(pendingToastId as any)

  return {
    type: 'regular',
    tx,
  }
}
