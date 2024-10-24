import { CHAINS } from '@lido-sdk/constants'

export const getGnosisSafeLink = (chainId: CHAINS, address: string) => {
  if (chainId === CHAINS.Holesky) {
    return `https://holesky-safe.protofire.io/transactions/queue?safe=holesky:${address}`
  }

  return `https://app.safe.global/transactions/queue?safe=eth:${address}`
}
