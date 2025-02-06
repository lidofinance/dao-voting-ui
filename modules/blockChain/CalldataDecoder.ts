import { BigNumber, utils } from 'ethers'
import { ABI } from './types'

type FactoryMap = Record<string, { abi: ABI }>

type FunctionSignatureIndex = Record<
  string,
  | {
      factoryName: string
      abi: ABI
    }[]
  | undefined
>

type CalldataParam =
  | string
  | number
  | BigNumber
  | {
      readonly [key: string]: CalldataParam
    }[]
// | CalldataParam[]

export type CalldataParams = {
  readonly [key: string]: CalldataParam
}

export type DecodedCalldata = {
  contractName: string
  functionName: string
  params: CalldataParams
}
export class CalldataDecoder {
  private signatureIndex: FunctionSignatureIndex = {}

  constructor(factoryMap: FactoryMap) {
    this.buildSignatureIndex(factoryMap)
  }

  public decode(calldata: string): DecodedCalldata | null {
    if (!calldata.startsWith('0x')) {
      return null
    }

    // Extract function selector (first 4 bytes after 0x)
    const selector = calldata.slice(0, 10)
    const potentialMatches = this.signatureIndex[selector]

    if (!potentialMatches) {
      return null
    }

    // Try each potential match
    for (const match of potentialMatches) {
      try {
        const iface = new utils.Interface(match.abi)
        const decoded = iface.parseTransaction({ data: calldata })

        return {
          contractName: match.factoryName.split('Abi__factory')[0],
          functionName: decoded.name,
          params: decoded.args,
        }
      } catch {
        continue
      }
    }

    return null
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

        this.signatureIndex[signature].push({
          factoryName: factoryName,
          abi: [func],
        })
      }
    }
  }
}
