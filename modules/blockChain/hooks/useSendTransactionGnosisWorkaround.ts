import { useCallback } from 'react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { PopulatedTransaction } from '@ethersproject/contracts'
import { sendTransactionGnosisWorkaround } from '../utils/sendTransactionGnosisWorkaround'
import { useIsContract } from './useIsContract'

export function useSendTransactionGnosisWorkaround() {
  const { walletAddress, web3Provider } = useWeb3()
  const { data: isMultisig } = useIsContract(walletAddress)

  return useCallback(
    (tx: PopulatedTransaction) =>
      sendTransactionGnosisWorkaround(web3Provider, tx, Boolean(isMultisig)),
    [web3Provider, isMultisig],
  )
}
