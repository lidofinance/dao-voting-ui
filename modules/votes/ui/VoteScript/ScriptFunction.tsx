import { ABIElement } from 'evm-script-decoder/lib/types'
import { ScriptBox } from './styles'
import { formatCallString } from './utils'

type Props = {
  abi?: ABIElement
  callData?: string[]
}

export function ScriptFunction({ abi, callData }: Props) {
  const callString = formatCallString(abi, callData)

  return <ScriptBox value={callString} />
}
