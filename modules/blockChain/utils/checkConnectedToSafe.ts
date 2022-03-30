import { getWalletNameFromProvider } from './getWalletNameFromProvider'

export function checkConnectedToSafe(provider: any) {
  const walletName = getWalletNameFromProvider(provider)
  return Boolean(walletName?.startsWith('Gnosis Safe'))
}
