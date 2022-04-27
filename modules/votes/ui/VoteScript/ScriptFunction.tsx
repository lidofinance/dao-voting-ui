import { ABIElement } from 'evm-script-decoder/lib/types'
import { ScriptFunctionWrapper } from './styles'

type Props = {
  abi?: ABIElement
  callData?: string[]
}

export function ScriptFunction({ abi, callData }: Props) {
  if (!abi) {
    return <p>ABI missing</p>
  }

  // TODO: add syntax highlighting
  return (
    <ScriptFunctionWrapper>
      <code>
        {`${abi.type} ${abi.name}(
        ${abi.inputs
          ?.map(
            ({ type, name }, i) =>
              `${type} ${name}, // ${String(callData![i])}`,
          )
          .join('\n\t')}
)
`}
      </code>
    </ScriptFunctionWrapper>
  )
}
