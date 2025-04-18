import { useConfig } from 'modules/config/hooks/useConfig'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import * as ADDR from 'modules/blockChain/contractAddresses'
import { useCallback } from 'react'
import { isTestnet } from '../utils/isTestnet'

export type ContractName = keyof typeof ADDR

export const useGetContractAddress = () => {
  const { savedConfig } = useConfig()
  const { chainId } = useWeb3()

  return useCallback(
    (contractName: ContractName) => {
      const isInTestMode = savedConfig.useTestContracts && isTestnet(chainId)

      const address = ADDR[contractName][chainId]

      if (!address) {
        return null
      }

      if (typeof address === 'string') {
        return address
      }

      return isInTestMode ? address.test : address.actual
    },
    [chainId, savedConfig.useTestContracts],
  )
}
