import { CHAINS } from '@lido-sdk/constants'

import { getUserdocByContractName } from 'modules/contracts/utils/getUserdoc'
import { getContractNameByAddress } from 'modules/contracts/utils/getContractNameByAddress'
import type {
  EVMScriptCall,
  EVMScriptDecoded,
} from '@lidofinance/evm-script-decoder/lib/types'

// No typings for radspec in npm
// TODO: write local typings
const radspec = require('radspec')

export type EVMScriptDescription = {
  contractName?: string
  methodName?: string
  evaluatedDescription?: string
  children?: EVMScriptDescription[]
}

async function describeScriptCall(call: EVMScriptCall, chainId: CHAINS) {
  const result: EVMScriptDescription = {}

  const contractName = getContractNameByAddress(call.address, chainId)

  if (contractName && call.abi) {
    const methodName = call.abi.name

    result.methodName = methodName
    result.contractName = contractName

    const methodInputs = (call.abi.inputs || [])
      .map(({ type }) => type)
      .join(',')
    const methodFormatted = `${methodName}(${methodInputs})`

    const userdoc = getUserdocByContractName(contractName)

    if (userdoc && userdoc.methods) {
      const expression = userdoc.methods[methodFormatted]?.notice

      if (expression) {
        const radspecData = {
          abi: [call.abi],
          transaction: {
            data: call.methodId + call.encodedCallData.slice(2),
          },
        }
        console.log('radspec payload', expression, radspecData)
        try {
          result.evaluatedDescription = await radspec.evaluate(
            expression,
            radspecData,
            // TODO: Check if we need anything here
            // {
            //   ethNode: wrapper.web3.currentProvider,
            //   currency: network.nativeCurrency,
            // },
          )
        } catch {
          result.evaluatedDescription = 'Radspec error'
        }
      }
    }

    const potentialChildren = (call.decodedCallData || [])
      .map(callData => {
        if (typeof callData === 'object' && callData.calls) {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          return describeScript(callData, chainId)
        }
        return undefined
      })
      .filter(Boolean)

    if (potentialChildren.length > 0) {
      const resolvedChildren = (await Promise.all(
        potentialChildren,
      )) as EVMScriptDescription[]
      result.children = resolvedChildren
    }
  }

  return result
}

export async function describeScript(
  decoded: EVMScriptDecoded,
  chainId: CHAINS,
) {
  const descriptionPromises = decoded.calls.map(call =>
    describeScriptCall(call, chainId),
  )

  const descriptions = await Promise.all(descriptionPromises)

  return descriptions
}
