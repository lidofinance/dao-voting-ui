import { CHAINS } from 'modules/blockChain/chains'
import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from '../../blockChain/hooks/useWeb3'

const ENS_NAME_ADDRESS = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'

const IGNORE_GAIANETWORK_PATTERN = /https?:\/\/api\.gaianet\.ai(?=[:/?#]|$)/i

export function useEnsNames(addresses: string[]) {
  const { chainId, rpcProvider } = useWeb3()

  const { data: ensNameList, initialLoading } = useSWR(
    [...addresses, chainId],
    async () => {
      if (chainId === CHAINS.Holesky || chainId === CHAINS.Hoodi) {
        rpcProvider.network.ensAddress = ENS_NAME_ADDRESS
      }

      const result: Record<string, string | null> = {}
      await Promise.all(
        addresses.map(address =>
          rpcProvider
            .lookupAddress(address)
            .then(ens => {
              result[address] = ens
            })
            .catch(error => {
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

      return result
    },
  )
  return {
    data: ensNameList,
    initialLoading,
  }
}
