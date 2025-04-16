import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useLidoSWRImmutable } from '@lido-sdk/react'
import { CHAINS } from '@lido-sdk/constants'
import { formatToken } from '../utils/formatToken'
import { useContractHelpers } from 'modules/blockChain/hooks/useContractHelpers'
import { BigNumber } from 'ethers'

export function useGovernanceTokenData() {
  const { walletAddress, chainId } = useWeb3()
  const { ldoHelpers } = useContractHelpers()
  const ldo = ldoHelpers.useRpc()

  return useLidoSWRImmutable(
    ['swr:useGovernanceTokenData', chainId, walletAddress, ldo.address],
    async (
      _key: string,
      _chainId: CHAINS,
      _walletAddress: string | null | undefined,
    ) => {
      let balance = BigNumber.from(0)
      if (_walletAddress?.length) {
        balance = await ldo.balanceOf(_walletAddress)
      }
      const symbol = await ldo.symbol()
      const balanceStr = formatToken(balance, symbol)

      return { balance, symbol, balanceStr }
    },
  )
}
