import { CHAINS } from 'modules/blockChain/chains'
import { getStaticRpcBatchProvider } from 'modules/blockChain/utils/rpcProviders'
import { useConfig } from 'modules/config/hooks/useConfig'
import { useCallback, useMemo } from 'react'

export const useEnsResolvers = () => {
  const { getRpcUrl } = useConfig()

  const ethProvider = useMemo(() => {
    const rpcUrl = getRpcUrl(CHAINS.Mainnet)
    return getStaticRpcBatchProvider(CHAINS.Mainnet, rpcUrl)
  }, [getRpcUrl])

  const lookupAddress = useCallback(
    async (address: string) => {
      return ethProvider.lookupAddress(address)
    },
    [ethProvider],
  )

  const resolveName = useCallback(
    async (address: string) => {
      return ethProvider.resolveName(address)
    },
    [ethProvider],
  )

  return {
    lookupAddress,
    resolveName,
  }
}
