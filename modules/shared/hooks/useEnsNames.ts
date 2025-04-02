import { CHAINS } from '@lido-sdk/constants'
import { useSWR } from 'modules/network/hooks/useSwr'
import { getStaticRpcBatchProvider } from '@lido-sdk/providers'
import { useWeb3 } from '../../blockChain/hooks/useWeb3'
import { useConfig } from '../../config/hooks/useConfig'

const ENS_NAME_ADDRESS = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'

const IGNORE_GAIANETWORK_PATTERN = /https?:\/\/api\.gaianet\.ai(?=[:/?#]|$)/i

export function useEnsNames(addresses: string[]) {
  const { chainId } = useWeb3()
  const { getRpcUrl } = useConfig()

  const { data: ensNameList, initialLoading } = useSWR(
    [...addresses, chainId],
    async () => {
      const rpcUrl = getRpcUrl(chainId)
      const provider = getStaticRpcBatchProvider(chainId, rpcUrl)
      if (chainId === CHAINS.Holesky || chainId === CHAINS.Hoodi) {
        provider.network.ensAddress = ENS_NAME_ADDRESS
      }
      const res = await Promise.all(
        addresses.map(address =>
          provider.lookupAddress(address).catch(error => {
            const _error = error as Error

            // TODO: add GNS support
            if (IGNORE_GAIANETWORK_PATTERN.test(_error.message)) {
              console.log(
                'Ignoring CSP error for api.gaianet.ai -> request api.gaianet.ai blocked by CSP, GNS not supported',
              )
              return null
            }
            throw error
          }),
        ),
      )

      return res
    },
  )
  return {
    data: ensNameList,
    initialLoading,
  }
}
