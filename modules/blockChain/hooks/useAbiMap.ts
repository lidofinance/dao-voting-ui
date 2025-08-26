import { useGlobalMemo } from 'modules/shared/hooks/useGlobalMemo'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import * as abis from 'generated'
import * as ADDR from 'modules/blockChain/contractAddresses'
import { ABI, AbiMap } from 'modules/blockChain/types'
import { useGetContractAddress } from './useGetContractAddress'

type ContractName = keyof typeof ADDR

// This object contains ABIs of contracts that are using the same ABI
// but have different names than the ABI file
const ABI_EXCEPTIONS = {
  HashConsensusAccountingOracle: abis.HashConsensusAbi__factory.abi,
  HashConsensusValidatorsExitBus: abis.HashConsensusAbi__factory.abi,
  LidoAppRepo: abis.RepoAbi__factory.abi,
  NodeOperatorsRegistryRepo: abis.RepoAbi__factory.abi,
  SimpleDVTRepo: abis.RepoAbi__factory.abi,
  OracleRepo: abis.RepoAbi__factory.abi,
  SimpleDVT: abis.NodeOperatorsRegistryAbi__factory.abi,
  SandboxNodeOperatorsRegistry: abis.NodeOperatorsRegistryAbi__factory.abi,
  CSVerifierProposed: abis.CSVerifierAbi__factory.abi,
  GateSealProposed: abis.GateSealAbi__factory.abi,
  CSMGateSeal: abis.GateSealAbi__factory.abi,
  CSMGateSealProposed: abis.GateSealAbi__factory.abi,
  DualGovernanceLegacy: abis.DualGovernanceAbi__factory.abi,
  DualGovernanceProposed: abis.DualGovernanceAbi__factory.abi,
  DualGovernanceConfigProvider: abis.DGConfigProviderAbi__factory.abi,
  DualGovernanceConfigProviderLegacy: abis.DGConfigProviderAbi__factory.abi,
} as const

type ExceptionContractName = keyof typeof ABI_EXCEPTIONS
type GeneralContractName = Exclude<ContractName, ExceptionContractName>

export function useAbiMap(): AbiMap {
  const { chainId } = useWeb3()
  const getContractAddress = useGetContractAddress()

  return useGlobalMemo(() => {
    // Map of contract addresses to their ABIs on the current chain
    // needed to initialize the localDecoder
    return Object.keys(ADDR).reduce((result, contractName: ContractName) => {
      try {
        const address = getContractAddress(contractName)

        let abi: ABI | undefined
        if (contractName in ABI_EXCEPTIONS) {
          abi = ABI_EXCEPTIONS[contractName as ExceptionContractName]
        } else {
          // This line will show a compiler-level error if there is a declared contract in ADDR
          // that is not present neither in ABI_EXCEPTIONS nor in generated abis
          abi = abis[`${contractName as GeneralContractName}Abi__factory`].abi
        }

        return {
          ...result,
          [address]: abi,
        }
      } catch (error) {
        return result
      }
    }, {} as Record<string, ABI>)
  }, `contracts-abi-map-${chainId}`)
}
