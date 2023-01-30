import { useCallback } from 'react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { PopulatedTransaction } from '@ethersproject/contracts'
import { sendTransactionGnosisWorkaround } from '../utils/sendTransactionGnosisWorkaround'

export function useSendTransactionGnosisWorkaround() {
  const { library } = useWeb3()
  return useCallback(
    (tx: PopulatedTransaction) =>
      sendTransactionGnosisWorkaround(library.getSigner(), tx),
    [library],
  )
}
