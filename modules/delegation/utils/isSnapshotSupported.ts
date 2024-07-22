import { CHAINS } from '@lido-sdk/constants'
import { ContractSnapshot } from 'modules/blockChain/contracts'

export const isSnapshotSupported = (chainId: CHAINS) => {
  return ContractSnapshot.address.hasOwnProperty(chainId)
}
