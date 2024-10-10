import { ContractTransaction } from '@ethersproject/contracts'
import { CHAINS } from '@lido-sdk/constants'

export type SafeTx = {
  safeTxHash: string
}

export type ResultTx =
  | {
      type: 'safe'
      tx: SafeTx
    }
  | {
      type: 'regular'
      tx: ContractTransaction
    }

export type TxStatus = 'empty' | 'pending' | 'failed' | 'success'

type Address = `0x${string}`

export type ChainAddressMap = Partial<Record<CHAINS, Address>>
