export function getWalletNameFromProvider(provider: any): string | undefined {
  if (provider.isMetaMask) {
    return 'MetaMask'
  }

  return provider.walletMeta?.name
}
