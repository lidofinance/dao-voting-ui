import {
  ABIElement,
  EVMScriptDecoded,
} from '@lidofinance/evm-script-decoder/lib/types'

export const formatCallString = (
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
        if (
          typeof data === 'object' &&
          abi?.inputs?.[i].name === '_evmScript'
        ) {
          callRes += `See parsed evm script at ${id}.${i + 1}`
        } else {
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
