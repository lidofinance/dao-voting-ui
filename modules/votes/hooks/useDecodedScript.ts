import { CHAINS } from 'modules/blockChain/chains'
import { EVMScriptDecoder } from '@lidofinance/evm-script-decoder'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useSWR } from 'modules/network/hooks/useSwr'
import { useEVMScriptDecoder } from './useEvmScriptDecoder'

export function useDecodedScript(script: string) {
  const { chainId } = useWeb3()
  const decoder = useEVMScriptDecoder()

  const { data, initialLoading } = useSWR(
    ['swr:decode-script', chainId, decoder, script],
    (
      _key: string,
      _chainId: CHAINS,
      _decoder: EVMScriptDecoder,
      _script: string,
    ) => _decoder.decodeEVMScript(_script as string),
  )

  return {
    initialLoading,
    binary: script,
    decoded: data,
  }
}
