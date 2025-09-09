import { useEffect, useState, useCallback } from 'react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useSendTransactionGnosisWorkaround } from './useSendTransactionGnosisWorkaround'

import { ResultTx, TxStatus } from '../types'
import { PopulatedTransaction } from '@ethersproject/contracts'
import { openWindow } from 'modules/shared/utils/openWindow'
import { getGnosisSafeLink } from '../utils/getGnosisSafeLink'
import { getEtherscanLink } from '../utils/getEtherscanLink'
import { getErrorMessage } from 'modules/shared/utils/getErrorMessage'
import { ToastError } from '@lidofinance/lido-ui'

type PopulateFn<A extends unknown[]> =
  | ((...args: A) => PopulatedTransaction)
  | ((...args: A) => Promise<PopulatedTransaction>)

export type FinishHandler = (resultTx: ResultTx, status: TxStatus) => void

export type Options = {
  onError?: () => void
  onFinish?: FinishHandler
}

export function useTransactionSender<A extends unknown[]>(
  populateTx: PopulateFn<A>,
  { onError, onFinish }: Options = {},
) {
  const { rpcProvider, walletAddress, chainId } = useWeb3()
  const [resultTx, setResultTx] = useState<ResultTx | null>(null)
  const [status, setStatus] = useState<TxStatus>('empty')
  const sendTransactionGnosisWorkaround = useSendTransactionGnosisWorkaround()

  const finish = useCallback(
    (finishStatus: TxStatus, finishTx: ResultTx) => {
      setStatus(finishStatus)
      if (finishStatus === 'success') onFinish?.(finishTx, finishStatus)
      if (finishStatus === 'failed') onError?.()
    },
    [onFinish, onError],
  )

  const send = useCallback(
    async (...args: A) => {
      try {
        setResultTx(null)
        setStatus('pending')

        const populatedTx = await populateTx(...args)
        const res = await sendTransactionGnosisWorkaround(populatedTx)

        setResultTx(res)
        if (res.type === 'safe') finish('success', res)
        return res
      } catch (error: any) {
        onError?.()
        setStatus('empty')
        console.error(error)
        ToastError(getErrorMessage(error), {})
        return null
      }
    },
    [finish, populateTx, sendTransactionGnosisWorkaround, onError],
  )

  useEffect(() => {
    if (!rpcProvider || !resultTx || resultTx.type === 'safe') {
      return
    }

    const { tx } = resultTx

    const checkTransaction = (e: any) => {
      if (!e) {
        setStatus('pending')
      } else if (e.status === 1 && status !== 'success') {
        finish('success', resultTx)
      } else if (e.status === 0 && status !== 'failed') {
        finish('failed', resultTx)
      }
    }

    rpcProvider.getTransactionReceipt(tx.hash).then(checkTransaction)
    rpcProvider.on(tx.hash, checkTransaction)

    return () => {
      rpcProvider.off(tx.hash)
    }
    // disable to avoid re-subscribing on `status` change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rpcProvider, resultTx, onFinish, finish])

  const open = useCallback(() => {
    if (!resultTx) return
    const link =
      resultTx.type === 'safe'
        ? getGnosisSafeLink(chainId, `${walletAddress}`)
        : getEtherscanLink(chainId, resultTx.tx.hash, 'tx')
    openWindow(link)
  }, [chainId, resultTx, walletAddress])

  return {
    tx: resultTx,
    send,
    open,
    status,
    isEmpty: status === 'empty',
    isFailed: status === 'failed',
    isPending: status === 'pending',
    isSuccess: status === 'success',
  }
}

export type TransactionSender = ReturnType<typeof useTransactionSender>
