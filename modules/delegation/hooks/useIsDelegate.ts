import { CHAINS } from 'modules/blockChain/chains'
import { useSWR } from 'modules/network/hooks/useSwr'
import { useContractHelpers } from 'modules/blockChain/hooks/useContractHelpers'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

export const useIsDelegate = () => {
  const { chainId, walletAddress } = useWeb3()
  const { votingHelpers } = useContractHelpers()
  const voting = votingHelpers.useRpc()

  return useSWR(
    walletAddress
      ? [`swr:useIsDelegate`, chainId, walletAddress, voting.address]
      : null,
    async (_key: string, _chainId: CHAINS, _walletAddress: string) => {
      const delegatorsCount = await voting.getDelegatedVotersCount(
        _walletAddress,
      )

      return delegatorsCount.gt(0)
    },
  )
}
