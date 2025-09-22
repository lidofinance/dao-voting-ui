import { CHAINS } from 'modules/blockChain/chains'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useCallback } from 'react'

export const useEnsResolvers = () => {
  const { chainId, rpcProvider } = useWeb3()

  const lookupAddress = useCallback(
    async (address: string) => {
      // ENS name is not supported on Holesky and Hoodi for our current setup
      // TODO: revisit this after package upgrade
      if (chainId === CHAINS.Holesky || chainId === CHAINS.Hoodi) {
        return null
      }

      return rpcProvider.lookupAddress(address)
    },
    [chainId, rpcProvider],
  )

  const resolveName = useCallback(
    async (address: string) => {
      // ENS name is not supported on Holesky and Hoodi for our current setup
      // TODO: revisit this after package upgrade
      if (chainId === CHAINS.Holesky || chainId === CHAINS.Hoodi) {
        return null
      }

      return rpcProvider.resolveName(address)
    },
    [chainId, rpcProvider],
  )

  return {
    lookupAddress,
    resolveName,
  }
}
