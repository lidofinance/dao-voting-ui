export type TenderlyBlockHeader = {
  baseFeePerGas: string
  difficulty: string
  extraData: string
  gasLimit: string
  gasUsed: string
  hash: string
  logsBloom: string
  miner: string
  mixHash: string
  nonce: string
  number: string
  parentHash: string
  receiptsRoot: string
  sha3Uncles: string
  size: string
  stateRoot: string
  timestamp: string
  totalDifficulty: string
  transactions: unknown
  transactionsRoot: string
  uncles: null | any
}

export type TenderlyReceipt = {
  blockHash: string
  blockNumber: string
  contractAddress: null | any
  cumulativeGasUsed: string
  effectiveGasPrice: string
  from: string
  gasUsed: string
  logs: any[]
  logsBloom: string
  status: string
  to: string
  transactionHash: string
  transactionIndex: string
  type: string
}

export type TenderlyStateObject = {
  address: string
  data: { balance: string }
}

export type TenderlyFork = {
  accounts: Record<string, string>
  block_number: number
  chain_config: {
    berlin_block: number
    byzantium_block: number
    chain_id: number
    clique: { period: number; epoch: number }
    constantinople_block: number
    dao_fork_support: boolean
    eip_150_block: number
    eip_150_hash: string
    eip_155_block: number
    eip_158_block: number
    homestead_block: number
    istanbul_block: number
    london_block: number
    petersburg_block: number
    polygon: {
      heimdall_url: string
      sprint_length_changelog: null | any
      state_sync: {
        do_not_skip: boolean
        event_records_amount_override: null | any
      }
    }
    shanghai_time: number
    type: string
  }
  created_at: string
  current_block_number: number
  fork_config: null | any
  id: string
  network_id: string
  project_id: string
  shared: false
  transaction_index: number
}

export type TenderlyTransaction = {
  access_list: null | any
  alias: string
  block_hash: string
  block_header: TenderlyBlockHeader
  block_number: number
  branch_root: boolean
  created_at: string
  deposit_tx: boolean
  description: string
  fork_height: number
  fork_id: string
  from: string
  gas: number
  gas_price: string
  hash: string
  id: string
  immutable: boolean
  input: string
  internal: boolean
  kind: string
  l1_block_number: number
  l1_message_sender: string
  l1_timestamp: number
  network_id: string
  nonce: number
  origin: string
  parent_id: string
  project_id: string
  receipt: TenderlyReceipt
  shared: boolean
  state_objects: TenderlyStateObject[]
  status: boolean
  system_tx: boolean
  timestamp: string
  to: string
  transaction_index: number
  value: string
}

export type TenderlyResponseForksList = {
  simulation_forks: TenderlyFork[]
}

export type TenderlyResponseForkTransactionsList = {
  fork_transactions: TenderlyTransaction[]
}

export type TenderlyForkResponse = {
  root_transaction: TenderlyTransaction
  simulation_fork: TenderlyFork
}
