import { CHAINS } from '@lido-sdk/constants'
import { useLidoSWR } from '@lido-sdk/react'
import { constants } from 'ethers'
import { ContractSnapshot, ContractVoting } from 'modules/blockChain/contracts'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { isSnapshotSupported } from '../utils/isSnapshotSupported'
import { SNAPSHOT_LIDO_SPACE_NAME } from '../constants'
import { useConfig } from 'modules/config/hooks/useConfig'

export const useDelegationInfo = () => {
  const { walletAddress, chainId } = useWeb3()
  const { getRpcUrl } = useConfig()
  const voting = ContractVoting.useRpc()

  return useLidoSWR(
    walletAddress
      ? ['swr:useDelegationInfo', chainId, walletAddress, getRpcUrl(chainId)]
      : null,
    async (
      _key: string,
      _chainId: CHAINS,
      _walletAddress: string,
      rpcUrl: string,
    ) => {
      let aragonDelegateAddress: string | null = await voting.getDelegate(
        _walletAddress,
      )
      if (aragonDelegateAddress === constants.AddressZero) {
        aragonDelegateAddress = null
      }

      let snapshotDelegateAddress: string | null = null
      const isSnapshotDelegationSupported = isSnapshotSupported(_chainId)
      if (isSnapshotDelegationSupported) {
        const snapshot = ContractSnapshot.connectRpc({ chainId, rpcUrl })
        snapshotDelegateAddress = await snapshot.delegation(
          _walletAddress,
          SNAPSHOT_LIDO_SPACE_NAME,
        )
        if (snapshotDelegateAddress === constants.AddressZero) {
          snapshotDelegateAddress = null
        }
      }

      return {
        aragonDelegateAddress,
        snapshotDelegateAddress,
        isSnapshotDelegationSupported,
      }
    },
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  )
}
