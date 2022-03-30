import memoize from 'lodash/memoize'
import { getStaticRpcBatchProvider } from '@lido-sdk/providers'
import { getRpcJsonUrls } from 'modules/blockChain/utils/getRpcUrls'
import { CHAINS } from '@lido-sdk/constants'

export const getLibraryRpc = memoize((chainId: CHAINS) => {
  const urls = getRpcJsonUrls(chainId)
  return getStaticRpcBatchProvider(chainId, urls[0])
})
