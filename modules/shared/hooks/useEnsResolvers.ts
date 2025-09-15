import { CHAINS } from 'modules/blockChain/chains'
import { getStaticRpcBatchProvider } from 'modules/blockChain/utils/rpcProviders'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useConfig } from 'modules/config/hooks/useConfig'
import { useCallback, useMemo } from 'react'

export const useEnsResolvers = () => {
  const { chainId } = useWeb3()
  const { getRpcUrl } = useConfig()

  const ethProvider = useMemo(() => {
    const rpcUrl = getRpcUrl(chainId)
    return getStaticRpcBatchProvider(chainId, rpcUrl)
  }, [chainId, getRpcUrl])

  const lookupAddress = useCallback(
    async (address: string) => {
      // ENS name is not supported on Holesky and Hoodi for our current setup
      // TODO: revisit this after package upgrade
      if (chainId === CHAINS.Holesky || chainId === CHAINS.Hoodi) {
        return null
      }

      return ethProvider.lookupAddress(address)
    },
    [chainId, ethProvider],
  )

  const resolveName = useCallback(
    async (address: string) => {
      // ENS name is not supported on Holesky and Hoodi for our current setup
      // TODO: revisit this after package upgrade
      if (chainId === CHAINS.Holesky || chainId === CHAINS.Hoodi) {
        return null
      }

      return ethProvider.resolveName(address)
    },
    [chainId, ethProvider],
  )

  return {
    lookupAddress,
    resolveName,
  }
}
