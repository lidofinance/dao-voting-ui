import { useWeb3 } from './useWeb3'
import { useIsContract } from './useIsContract'

export const useIsMultisig = () => {
  const { walletAddress } = useWeb3()
  const { data: isContract, isLoading: loading } = useIsContract(
    walletAddress ?? undefined,
  )
  return [isContract, loading]
}
