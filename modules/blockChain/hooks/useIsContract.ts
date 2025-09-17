import { useSWRImmutable } from 'modules/network/hooks/useSwr'
import { useWeb3 } from './useWeb3'

export const useIsContract = () => {
  const { walletAddress, chainId, rpcProvider } = useWeb3()

  return useSWRImmutable(
    walletAddress ? `is-contract-${chainId}-${walletAddress}` : null,
    async () => {
      if (!walletAddress || !rpcProvider) return false

      const code = await rpcProvider.getCode(walletAddress)

      return Boolean(code && code !== '0x')
    },
  )
}
