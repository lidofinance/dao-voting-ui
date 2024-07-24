import { CHAINS } from '@lido-sdk/constants'
import { useLidoSWRImmutable } from '@lido-sdk/react'
import { constants } from 'ethers'
import { ContractSnapshot, ContractVoting } from 'modules/blockChain/contracts'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { SNAPSHOT_LIDO_SPACE_NAME } from '../constants'

export const useDelegationInfo = () => {
  const { walletAddress, chainId } = useWeb3()
  const voting = ContractVoting.useRpc()
  const snapshot = ContractSnapshot.useRpc()

  return useLidoSWRImmutable(
    walletAddress ? ['swr:useDelegationInfo', chainId, walletAddress] : null,
    async (_key: string, _chainId: CHAINS, _walletAddress: string) => {
      let aragonDelegateAddress: string | null = (
        await voting.getDelegate(_walletAddress)
      ).toLowerCase()
      if (aragonDelegateAddress === constants.AddressZero) {
        aragonDelegateAddress = null
      }

      let snapshotDelegateAddress: string | null = null
      snapshotDelegateAddress = (
        await snapshot.delegation(_walletAddress, SNAPSHOT_LIDO_SPACE_NAME)
      ).toLowerCase()
      if (snapshotDelegateAddress === constants.AddressZero) {
        snapshotDelegateAddress = null
      }

      return {
        aragonDelegateAddress,
        snapshotDelegateAddress,
      }
    },
  )
}
