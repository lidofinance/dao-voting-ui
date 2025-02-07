import { useGlobalMemo } from 'modules/shared/hooks/useGlobalMemo'
import { CalldataDecoder } from '../CalldataDecoder'
import * as factories from 'generated/factories'

export function useCalldataDecoder(): CalldataDecoder {
  return useGlobalMemo(() => {
    return new CalldataDecoder(factories)
  }, `calldata-decoder`)
}
