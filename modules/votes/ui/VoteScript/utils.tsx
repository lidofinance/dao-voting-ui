import {
  ABIElement,
  EVMScriptDecoded,
} from '@lidofinance/evm-script-decoder/lib/types'
// import { DEFAULT_ADMIN_ROLE, LIDO_ROLES } from 'modules/votes/constants'
import { utils } from 'ethers'
import { getContractName } from 'modules/config/utils/getContractName'
import { CHAINS } from 'modules/blockChain/chains'
import { DEFAULT_ADMIN_ROLE, LIDO_ROLES } from 'modules/votes/constants'

const stringifyArray = (arr: any[], separator = ',\n'): string => {
  const result = arr
    .map(item => {
      if (Array.isArray(item)) {
        return `[${stringifyArray(item, ', ')}]`
      }
      return item.toString()
    })
    .join(separator)

  return result
}

export const formatCallString = (
  chainId: CHAINS,
  id: number,
  abi?: ABIElement,
  callData?: (string | EVMScriptDecoded)[],
) => {
  let res = ''

  if (abi) {
    let inputsFormatted = abi.inputs
      ?.map(input => `\n\t${input.type} ${input.name}`)
      .join(',')
    if (inputsFormatted) inputsFormatted += '\n'

    res += `${abi.type} ${abi.name}(${inputsFormatted})`
    res += '\n\nCall data:\n'
  } else {
    res += '[abi not found]\n'
  }

  if (callData && callData.length) {
    res += callData
      .map((data, i) => {
        let callRes = `[${i + 1}] `
        if (typeof data === 'object') {
          if (abi?.inputs?.[i].name === '_evmScript') {
            callRes += `See parsed evm script at ${id}.${i + 1}`
          } else if (abi?.inputs?.[i].name === 'calls') {
            if ('calls' in data) {
              const callsLength = data.calls.length
              callRes += `See ${callsLength} parsed call${
                callsLength === 1 ? '' : 's'
              } at ${id}.${i + 1} — ${id}.${i + 1 + callsLength - 1}`
            } else {
              callRes += `See parsed calls below`
            }
            // Try to parse custom tuple type
          } else if (Array.isArray(data)) {
            callRes += `\n[${stringifyArray(data)}]`
          }
        } else {
          if (typeof data === 'string') {
            if (data === '') {
              callRes += '[empty string]'
            } else {
              let roleLabel: string | undefined
              if (data.startsWith('0x') && data.length === 66) {
                if (data === DEFAULT_ADMIN_ROLE) {
                  roleLabel = 'DEFAULT ADMIN ROLE'
                } else {
                  roleLabel = LIDO_ROLES[data]
                }
              }

              if (roleLabel?.length) {
                callRes += `[${roleLabel}] `
              } else if (utils.isAddress(data)) {
                const contractName = getContractName(chainId, data)
                if (contractName) {
                  callRes += `[${contractName}] `
                }
              }
            }
          }
          callRes += data
        }
        return callRes
      })
      .join('\n')
  } else if (callData && !callData.length) {
    res += '[empty]'
  } else {
    res += '[call data not found]'
  }

  res += '\n'

  return res
}
