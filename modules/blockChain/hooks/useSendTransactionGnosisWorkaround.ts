import { useCallback } from 'react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { PopulatedTransaction } from '@ethersproject/contracts'
import { sendTransactionGnosisWorkaround } from '../utils/sendTransactionGnosisWorkaround'
import { useIsMultisig } from './useIsMultisig'

export function useSendTransactionGnosisWorkaround() {
  const { web3Provider } = useWeb3()
  // TODO: track loading state of this swr in the ui on yes/no/enact button
  const [isMultisig] = useIsMultisig()

  return useCallback(
    (tx: PopulatedTransaction) =>
      sendTransactionGnosisWorkaround(web3Provider, tx, Boolean(isMultisig)),
    [web3Provider, isMultisig],
  )
}
