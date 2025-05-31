import { FC } from 'react'
import { WagmiConfig, configureChains, createClient } from 'wagmi'
import * as wagmiChains from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { getConnectors } from 'reef-knot/core-react'
import getConfig from 'next/config'
import { getRpcUrlDefault } from 'modules/config'
import { CHAINS } from '@lido-sdk/constants'

export const holesky = {
  id: CHAINS.Holesky,
  name: 'Holesky',
  network: 'holesky',
  nativeCurrency: {
    decimals: 18,
    name: 'holeskyETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: [getRpcUrlDefault(CHAINS.Holesky)] },
    default: { http: [getRpcUrlDefault(CHAINS.Holesky)] },
  },
  blockExplorers: {
    etherscan: { name: 'holesky', url: 'https://holesky.etherscan.io/' },
    default: { name: 'holesky', url: 'https://holesky.etherscan.io/' },
  },
  testnet: true,
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 77,
    },
  },
} as const

export const hoodi = {
  id: CHAINS.Hoodi,
  name: 'Hoodi',
  network: 'hoodi',
  nativeCurrency: {
    decimals: 18,
    name: 'hoodiETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: [getRpcUrlDefault(CHAINS.Hoodi)] },
    default: { http: [getRpcUrlDefault(CHAINS.Hoodi)] },
  },
  blockExplorers: {
    etherscan: { name: 'hoodi', url: 'https://hoodi.etherscan.io/' },
    default: { name: 'hoodi', url: 'https://hoodi.etherscan.io/' },
  },
  testnet: true,
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 2589,
    },
  },
} as const

const { publicRuntimeConfig } = getConfig()

let supportedChainIds: number[] = []
if (publicRuntimeConfig.supportedChains != null) {
  supportedChainIds = publicRuntimeConfig.supportedChains
    .split(',')
    .map((chainId: string) => parseInt(chainId))
    .filter((chainId: number) => !Number.isNaN(chainId))
} else if (publicRuntimeConfig.defaultChain != null) {
  supportedChainIds = [parseInt(publicRuntimeConfig.defaultChain)]
}

const wagmiChainsArray = Object.values({
  ...wagmiChains,
  [CHAINS.Holesky]: holesky,
  [CHAINS.Hoodi]: hoodi,
})
const supportedChains = wagmiChainsArray.filter(
  chain =>
    // Temporary wagmi fix, need to hardcode it to not affect non-wagmi wallets
    supportedChainIds.includes(chain.id) || chain.id === 80001,
)
const defaultChain = wagmiChainsArray.find(
  chain => chain.id === parseInt(publicRuntimeConfig.defaultChain),
)

const backendRPC = supportedChainIds.reduce<Record<number, string>>(
  (res, curr) => ({ ...res, [curr]: getRpcUrlDefault(curr) }),
  {
    // Required by reef-knot
    [CHAINS.Mainnet]: getRpcUrlDefault(CHAINS.Mainnet),
  },
)

const { chains, provider, webSocketProvider } = configureChains(
  supportedChains,
  [
    jsonRpcProvider({
      rpc: chain => ({
        http: backendRPC[chain.id],
      }),
    }),
  ],
)

const connectors = getConnectors({
  chains,
  defaultChain,
  rpc: backendRPC,
  walletconnectProjectId: publicRuntimeConfig.walletconnectProjectId,
})

const client = createClient({
  connectors,
  autoConnect: true,
  provider,
  webSocketProvider,
})

export const AppWagmiConfig: FC = ({ children }) => {
  return <WagmiConfig client={client}>{children}</WagmiConfig>
}
