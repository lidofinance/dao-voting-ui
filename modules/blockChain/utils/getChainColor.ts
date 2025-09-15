import { CHAINS } from '../chains'

export const CHAINS_COLORS: {
  [key in CHAINS]?: string
} = {
  [CHAINS.Mainnet]: '#29b6af',
  [CHAINS.Holesky]: '#AA346A',
  [CHAINS.Hoodi]: '#AA346A',
}

export const CHAIN_COLOR_FALLBACK = '#7a8aa0'

export const getChainColor = (chainId: number): string => {
  return CHAINS_COLORS[chainId as CHAINS] || CHAIN_COLOR_FALLBACK
}
