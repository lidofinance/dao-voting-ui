import { PUBLIC_DELEGATES } from '../publicDelegates'
import { PublicDelegate } from '../types'

export const getPublicDelegateByAddress = (
  address: string,
): PublicDelegate | null =>
  PUBLIC_DELEGATES.find(
    delegate => delegate.address.toLowerCase() === address.toLowerCase(),
  ) ?? null
