import { useGlobalMemo } from 'modules/shared/hooks/useGlobalMemo'
import { CalldataDecoder } from '../CalldataDecoder'
import * as factories from 'generated/factories'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useConfig } from 'modules/config/hooks/useConfig'

export function useCalldataDecoder(): CalldataDecoder {
  const { chainId } = useWeb3()
  const { getRpcUrl } = useConfig()

  return useGlobalMemo(() => {
    const rpcUrl = getRpcUrl(chainId)
    return new CalldataDecoder(factories, chainId, rpcUrl)
  }, `calldata-decoder`)
}
