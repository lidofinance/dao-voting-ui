import {
  ABIElement,
  EVMScriptDecoded,
} from '@lidofinance/evm-script-decoder/lib/types'
import { LIDO_ROLES } from 'modules/votes/constants'
import { utils } from 'ethers'
import { getContractName } from 'modules/config/utils/getContractName'
import { CHAINS } from '@lido-sdk/constants'

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
            callRes += `See parsed calls at ${id}.${i + 1}`
          }
        } else {
          if (typeof data === 'string') {
            if (data === '') {
              callRes += '[empty string]'
            } else {
              const roleLabel = LIDO_ROLES[data]
              if (roleLabel) {
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
