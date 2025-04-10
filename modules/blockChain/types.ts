import { ContractTransaction } from '@ethersproject/contracts'
import { CHAINS } from '@lido-sdk/constants'
import { ABIElement as ABIElementImported } from '@lidofinance/evm-script-decoder/lib/types'

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

export type Address = `0x${string}`

export type ChainAddressMap = Partial<
  Record<CHAINS, Address | { test: Address; actual: Address }>
>

// This is a little hack needed because some of local ABIs
// doesn't meet the ABIElement type requirements
export type ABIElement = Omit<ABIElementImported, 'name' | 'type'> & {
  name?: string
  type?: string
}

export type ABI = ABIElement[]
