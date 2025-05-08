import { BigNumber, Contract, utils } from 'ethers'
import { ABI, AbiMap } from './types'
import { getStaticRpcBatchProvider } from '@lido-sdk/providers'
import { CHAINS } from '@lido-sdk/constants'
import { StaticJsonRpcBatchProvider } from '@lido-sdk/providers/dist/esm/staticJsonRpcBatchProvider'
import { getPanicReason } from './utils/getPanicReason'
import { isAddress } from 'ethers/lib/utils'
import { getContractName } from 'modules/config/utils/getContractName'
import { ABIElement as ABIElementImported } from '@lidofinance/evm-script-decoder/lib/types'
import { fetcherEtherscan } from 'modules/network/utils/fetcherEtherscan'

type FunctionSignatureMap = Record<
  string,
  | {
      contractAddress: string
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
  contractAddress: string
  functionName: string
  params: CalldataParams
  contractName?: string
  abi?: ABIElementImported
}
export class CalldataDecoder {
  private signatureMap: FunctionSignatureMap = {}
  private provider: StaticJsonRpcBatchProvider
  private chainId: CHAINS
  private abiMap: AbiMap
  private etherscanApiKey: string | undefined

  constructor(
    abiMap: AbiMap,
    chainId: CHAINS,
    rpcUrl: string,
    etherscanApiKey?: string,
  ) {
    this.provider = getStaticRpcBatchProvider(chainId, rpcUrl)
    this.chainId = chainId
    this.abiMap = abiMap
    this.etherscanApiKey = etherscanApiKey
    this.buildSignatureMap()
  }

  public decode(calldata: string): DecodedCalldata[] {
    if (!calldata.startsWith('0x')) {
      return []
    }

    // Extract function selector (first 4 bytes after 0x)
    const selector = calldata.slice(0, 10)
    const potentialMatches = this.signatureMap[selector]

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
          contractAddress: match.contractAddress,
          contractName:
            getContractName(this.chainId, match.contractAddress) ?? 'Unknown',
          functionName: decoded.name,
          params: decoded.args,
        })
      } catch {
        continue
      }
    }

    return matches
  }

  public async decodeWithAddress(
    address: string,
    calldata: string,
  ): Promise<DecodedCalldata | null> {
    if (!calldata.startsWith('0x')) {
      return null
    }

    const abi = await this.getAbiByAddress(address)

    if (!abi) {
      return null
    }

    try {
      const iface = new utils.Interface(abi)
      const decoded = iface.parseTransaction({ data: calldata })

      const functionSig = calldata.slice(0, 10)
      const matchedAbiElement = abi.find(abiElement => {
        if (abiElement.type !== 'function') return false

        // Generate the function selector for this ABI element
        try {
          const fragment = utils.FunctionFragment.from(abiElement)
          const selector = utils.id(fragment.format()).slice(0, 10)
          return selector === functionSig
        } catch {
          return false
        }
      })
      return {
        contractAddress: address,
        contractName: getContractName(this.chainId, address) ?? 'Unknown',
        functionName: decoded.name,
        params: decoded.args,
        abi: matchedAbiElement as ABIElementImported,
      }
    } catch {
      return null
    }
  }

  public async simulateTransaction(
    matchedCalldata: DecodedCalldata,
    from?: string,
  ): Promise<SimulationResult> {
    const abi = await this.getAbiByAddress(matchedCalldata.contractAddress)
    if (!abi) {
      return {
        success: false,
        error: {
          reason: `ABI not found for ${matchedCalldata.contractAddress}`,
          isCustomError: false,
        },
      }
    }
    const contract = new Contract(
      matchedCalldata.contractAddress,
      abi,
      this.provider,
    )

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

  private buildSignatureMap(): void {
    for (const [address, abi] of Object.entries(this.abiMap)) {
      // Only index function entries
      const functionAbi = abi!.filter(item => item.type === 'function')

      for (const func of functionAbi) {
        const iface = new utils.Interface([func])
        const functionFragment = Object.values(iface.functions)[0]
        const signature = iface.getSighash(functionFragment)

        if (!this.signatureMap[signature]) {
          this.signatureMap[signature] = []
        }

        this.signatureMap[signature]!.push({
          contractAddress: address,
          abi: [func],
        })
      }
    }
  }

  private async getAbiByAddress(address: string): Promise<ABI | undefined> {
    const abi = this.abiMap[address]
    if (!abi) {
      try {
        // Try to fetch the ABI from etherscan
        const res = await fetcherEtherscan<string>({
          chainId: this.chainId,
          address,
          module: 'contract',
          action: 'getabi',
          apiKey: this.etherscanApiKey,
        })
        return JSON.parse(res)
      } catch (error) {
        console.error(`Error fetching ABI for ${address}:`, error)
        return
      }
    }

    return abi
  }
}
