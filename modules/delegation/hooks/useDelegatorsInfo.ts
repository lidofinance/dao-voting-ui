import { CHAINS } from '@lido-sdk/constants'
import { useLidoSWR } from '@lido-sdk/react'
import { ContractVoting } from 'modules/blockChain/contracts'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

export function useDelegatorsInfo() {
  const { walletAddress, chainId } = useWeb3()
  const voting = ContractVoting.useRpc()

  return useLidoSWR(
    walletAddress ? [`swr:useDelegatorsInfo`, chainId, walletAddress] : null,
    async (_key: string, _chainId: CHAINS, _walletAddress: string) => {
      const delegatorsCount = (
        await voting.getDelegatedVotersCount(_walletAddress)
      ).toNumber()

      return { delegatorsCount }
    },
  )
}
