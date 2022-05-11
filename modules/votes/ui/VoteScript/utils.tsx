import { ABIElement } from 'evm-script-decoder/lib/types'

export const formatCallString = (abi?: ABIElement, callData?: string[]) => {
  let res = 'Code:\n'

  if (abi) {
    let inputsFormatted = abi.inputs
      ?.map(input => `\n\t${input.type} ${input.name}`)
      .join(',')
    if (inputsFormatted) inputsFormatted += '\n'

    res += `${abi.type} ${abi.name}(${inputsFormatted})`
  } else {
    res += '[abi not found]'
  }

  res += '\n\nCall data:\n'
  if (callData) {
    res += callData.map((data, i) => `[${i}] ${data}`).join('\n')
  } else {
    res += '[call data not found]'
  }

  res += '\n'

  return res
}
