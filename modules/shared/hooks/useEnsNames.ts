import { CHAINS } from '@lido-sdk/constants'
import { useSWR } from 'modules/network/hooks/useSwr'
import { getStaticRpcBatchProvider } from '@lido-sdk/providers'
import { useWeb3 } from '../../blockChain/hooks/useWeb3'
import { useConfig } from '../../config/hooks/useConfig'

const ENS_NAME_ADDRESS = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'

export function useEnsNames(addresses: string[]) {
  const { chainId } = useWeb3()
  const { getRpcUrl } = useConfig()

  const { data: ensNameList, initialLoading } = useSWR(
    [...addresses, chainId],
    async () => {
      const rpcUrl = getRpcUrl(chainId)
      const provider = getStaticRpcBatchProvider(chainId, rpcUrl)
      if (chainId === CHAINS.Holesky) {
        provider.network.ensAddress = ENS_NAME_ADDRESS
      }
      const res = await Promise.all(
        addresses.map(address => provider.lookupAddress(address)),
      )
      return res
    },
  )
  return {
    data: ensNameList,
    initialLoading,
  }
}
