import { useGlobalMemo } from 'modules/shared/hooks/useGlobalMemo'
import { CalldataDecoder } from '../CalldataDecoder'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useConfig } from 'modules/config/hooks/useConfig'
import { useAbiMap } from './useAbiMap'

export function useCalldataDecoder(): CalldataDecoder {
  const { chainId } = useWeb3()
  const { getRpcUrl, savedConfig } = useConfig()
  const abiMap = useAbiMap()

  return useGlobalMemo(() => {
    const rpcUrl = getRpcUrl(chainId)
    return new CalldataDecoder(
      abiMap,
      chainId,
      rpcUrl,
      savedConfig.etherscanApiKey,
    )
  }, `calldata-decoder`)
}
