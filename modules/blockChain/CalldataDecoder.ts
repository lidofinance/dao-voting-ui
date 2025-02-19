import { BigNumber, Contract, utils } from 'ethers'
import { ABI } from './types'
import { getStaticRpcBatchProvider } from '@lido-sdk/providers'
import { CHAINS } from '@lido-sdk/constants'
import { StaticJsonRpcBatchProvider } from '@lido-sdk/providers/dist/esm/staticJsonRpcBatchProvider'
import { getPanicReason } from './utils/getPanicReason'
import * as addressMaps from 'modules/blockChain/contractAddresses'
import { isAddress } from 'ethers/lib/utils'

type ContractName = keyof typeof addressMaps

type FactoryName = `${ContractName}Abi__factory`

const getContractName = (factoryName: FactoryName): ContractName =>
  factoryName.split('Abi__factory')[0] as ContractName

type FactoryMap = Record<string, { abi: ABI }>

type FunctionSignatureIndex = Record<
  string,
  | {
      factoryName: FactoryName
      abi: ABI
    }[]
  | undefined
>

type DecodedError = {
  reason: string
  isCustomError: boolean
  errorName?: string
  errorArgs?: any
}

type SimulationResult = {
  success: boolean
  error?: DecodedError
}

type CalldataParam =
  | string
  | number
  | BigNumber
  | {
      readonly [key: string]: CalldataParam
    }[]

export type CalldataParams = {
  readonly [key: string]: CalldataParam
}

export type DecodedCalldata = {
  factoryName: FactoryName
  contractName: ContractName
  functionName: string
  params: CalldataParams
}
export class CalldataDecoder {
  private signatureIndex: FunctionSignatureIndex = {}
  private provider: StaticJsonRpcBatchProvider
  private chainId: CHAINS
  private abiMap: Record<string, ABI> = {}

  constructor(factoryMap: FactoryMap, chainId: CHAINS, rpcUrl: string) {
    this.buildSignatureIndex(factoryMap)
    this.provider = getStaticRpcBatchProvider(chainId, rpcUrl)
    this.chainId = chainId
  }

  public decode(calldata: string): DecodedCalldata[] {
    if (!calldata.startsWith('0x')) {
      return []
    }

    // Extract function selector (first 4 bytes after 0x)
    const selector = calldata.slice(0, 10)
    const potentialMatches = this.signatureIndex[selector]

    if (!potentialMatches) {
      return []
    }

    const matches: DecodedCalldata[] = []

    // Try each potential match
    for (const match of potentialMatches) {
      try {
        const iface = new utils.Interface(match.abi)
        const decoded = iface.parseTransaction({ data: calldata })
        matches.push({
          factoryName: match.factoryName,
          contractName: getContractName(match.factoryName),
          functionName: decoded.name,
          params: decoded.args,
        })
      } catch {
        continue
      }
    }

    return matches
  }

  public async simulateTransaction(
    matchedCalldata: DecodedCalldata,
    from?: string,
  ): Promise<SimulationResult> {
    const contractAddress =
      addressMaps[matchedCalldata.contractName][this.chainId]

    if (!contractAddress) {
      return {
        success: false,
        error: {
          reason: `Contract address not found for ${matchedCalldata.contractName}`,
          isCustomError: true,
        },
      }
    }

    const abi = this.abiMap[matchedCalldata.factoryName]
    const contract = new Contract(contractAddress, abi, this.provider)

    try {
      if (from?.length && !isAddress(from)) {
        throw new Error('Invalid from address')
      }

      const paramsArray = Array.isArray(matchedCalldata.params)
        ? matchedCalldata.params
        : Object.values(matchedCalldata.params)

      await contract.callStatic[matchedCalldata.functionName](...paramsArray, {
        from,
      })
    } catch (error: any) {
      console.error('Simulation error:', error)
      const errorString: string = error.toString()

      if (errorString.includes('errorName=')) {
        const errorNameMatch = errorString.match(/errorName="([^"]+)"/)
        const errorArgsMatch = errorString.match(/errorArgs=\[(.*?)\]/)

        return {
          success: false,
          error: {
            reason: `${errorNameMatch?.[1] || 'Unknown'}`,
            errorName: errorNameMatch?.[1],
            errorArgs:
              errorArgsMatch?.[1]?.split(',').map(arg => arg.trim()) || [],
            isCustomError: true,
          },
        }
      }

      // Check for regular revert string
      const revertMatch = errorString.match(
        /reverted with reason string '(.*)'/,
      )
      if (revertMatch) {
        return {
          success: false,
          error: {
            reason: revertMatch[1],
            isCustomError: false,
          },
        }
      }

      // Check for panic code
      const panicMatch = errorString.match(
        /reverted with panic code (0x[0-9a-f]+)/,
      )
      if (panicMatch) {
        return {
          success: false,
          error: {
            reason: `Panic: ${getPanicReason(panicMatch[1])}`,
            isCustomError: false,
          },
        }
      }

      // Default error case
      return {
        success: false,
        error: {
          reason: errorString,
          isCustomError: false,
        },
      }
    }

    return {
      success: true,
    }
  }

  private buildSignatureIndex(factoryMap: FactoryMap): void {
    for (const [factoryName, factory] of Object.entries(factoryMap)) {
      // Only index function entries
      const functionAbi = factory.abi.filter(item => item.type === 'function')

      for (const func of functionAbi) {
        const iface = new utils.Interface([func])
        const functionFragment = Object.values(iface.functions)[0]
        const signature = iface.getSighash(functionFragment)

        if (!this.signatureIndex[signature]) {
          this.signatureIndex[signature] = []
        }

        this.signatureIndex[signature]!.push({
          factoryName: factoryName as FactoryName,
          abi: [func],
        })
      }
    }

    Object.entries(factoryMap).map(([factoryName, factory]) => {
      this.abiMap[factoryName] = factory.abi
    })
  }
}
