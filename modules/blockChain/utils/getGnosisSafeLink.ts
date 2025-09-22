import { CHAINS } from '../chains'

export const getGnosisSafeLink = (chainId: CHAINS, address: string) => {
  switch (chainId) {
    case CHAINS.Holesky:
      return `https://holesky-safe.protofire.io/transactions/queue?safe=holesky:${address}`
    case CHAINS.Hoodi:
      return `https://app.safe.protofire.io/transactions/queue?safe=hoodi:${address}`
    default:
      return `https://app.safe.global/transactions/queue?safe=eth:${address}`
  }
}
