import { useConfig } from 'modules/config/hooks/useConfig'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import * as ADDR from 'modules/blockChain/contractAddresses'
import { useCallback } from 'react'
import { isTestnet } from '../utils/isTestnet'
import { getChainName } from '../chains'

export type ContractName = keyof typeof ADDR

export const useGetContractAddress = () => {
  const { savedConfig } = useConfig()
  const { chainId } = useWeb3()

  return useCallback(
    (contractName: ContractName) => {
      const isInTestMode = savedConfig.useTestContracts && isTestnet(chainId)

      const address = ADDR[contractName][chainId]

      if (!address) {
        throw new Error(
          `Contract address for ${contractName} not found for ${getChainName(
            chainId,
          )}`,
        )
      }

      if (typeof address === 'string') {
        return address
      }

      return isInTestMode ? address.test : address.actual
    },
    [chainId, savedConfig.useTestContracts],
  )
}
