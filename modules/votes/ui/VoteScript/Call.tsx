import { getEtherscanAddressLink } from '@lido-sdk/helpers'
import { Link } from '@lidofinance/lido-ui'
import { EVMScriptCall } from 'evm-script-decoder/lib/types'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { ScriptFunction } from './ScriptFunction'
import { CallTitle, CallWrapper } from './styles'

type Props = {
  id: number
  call: EVMScriptCall
}

export function Call({ id, call }: Props) {
  const { chainId } = useWeb3()

  const { address, abi, decodedCallData } = call

  return (
    <CallWrapper>
      <CallTitle color="text" size="xxs">
        {id}. On{' '}
        <Link href={getEtherscanAddressLink(chainId, address)}>{address}</Link>
      </CallTitle>
      <ScriptFunction abi={abi} callData={decodedCallData} />
    </CallWrapper>
  )
}
