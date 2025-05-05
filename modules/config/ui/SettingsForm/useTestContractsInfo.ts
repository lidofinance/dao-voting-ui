import { useMemo } from 'react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import * as ADDR from 'modules/blockChain/contractAddresses'

type ContractName = keyof typeof ADDR

export function useTestContractsInfo() {
  const { chainId } = useWeb3()

  return useMemo(() => {
    const testContracts: { name: string; address: string }[] = []
    for (const contractName in ADDR) {
      const address = ADDR[contractName as ContractName][chainId]
      if (typeof address === 'object') {
        testContracts.push({
          name: contractName,
          address: address.test,
        })
      }
    }
    return testContracts
  }, [chainId])
}
