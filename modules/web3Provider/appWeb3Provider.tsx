import { FC, PropsWithChildren, useMemo } from 'react'
import * as wagmiChains from 'wagmi/chains'
import getConfig from 'next/config'
import { WagmiProvider } from 'wagmi'
import { useConfig } from 'modules/config/hooks/useConfig'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReefKnotProvider, getDefaultConfig } from 'reef-knot/core-react'
import {
  ReefKnotWalletsModal,
  getDefaultWalletsModalConfig,
} from 'reef-knot/connect-wallet-modal'
import { WalletIdsEthereum, WalletsListEthereum } from 'reef-knot/wallets'
import { useThemeToggle } from '@lidofinance/lido-ui'
import { Web3LegacyProvider } from './web3LegacyProvider'
import { PROVIDER_POLLING_INTERVAL } from 'modules/blockChain/utils/rpcProviders'

type ChainsList = [wagmiChains.Chain, ...wagmiChains.Chain[]]

const WALLETS_PINNED: WalletIdsEthereum[] = ['browserExtension']

const WALLETS_SHOWN: WalletIdsEthereum[] = [
  'browserExtension',
  'metaMask',
  'okx',
  'ledgerHID',
  'ledgerLive',
  'walletConnect',
  'bitget',
  'imToken',
  'ambire',
  'safe',
  'dappBrowserInjected',
  'coinbaseSmartWallet',
]

const wagmiChainsArray = Object.values(wagmiChains) as any as ChainsList

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: 'always',
      staleTime: 30000,
      gcTime: 60000,
      retry: (failureCount, error: any) => {
        if (
          error?.message?.includes('429') ||
          error?.message?.includes('rate limit')
        ) {
          return false
        }
        return failureCount < 2
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})

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

const defaultChainId = wagmiChainsArray.find(
  chain => chain.id === parseInt(publicRuntimeConfig.defaultChain),
)?.id

export const AppWeb3Provider: FC<PropsWithChildren> = ({ children }) => {
  const { themeName } = useThemeToggle()

  const { getRpcUrl } = useConfig()
  const backendRPC: Record<number, string> = useMemo(
    () =>
      supportedChainIds.reduce(
        (res, curr) => ({ ...res, [curr]: getRpcUrl(curr) }),
        {},
      ),
    [getRpcUrl],
  )

  const chains = useMemo(() => {
    const supportedChains = wagmiChainsArray.filter(chain =>
      supportedChainIds.includes(chain.id),
    )

    const defaultChain =
      supportedChains.find(chain => chain.id === defaultChainId) ||
      supportedChains[0] // first supported chain as fallback
    return {
      supportedChains: supportedChains as ChainsList,
      defaultChain,
    }
  }, [])

  const { wagmiConfig, reefKnotConfig, walletsModalConfig } = useMemo(() => {
    return getDefaultConfig({
      // Reef-Knot config args
      rpc: backendRPC,
      defaultChain: chains.defaultChain,
      walletconnectProjectId: publicRuntimeConfig.walletconnectProjectId,
      walletsList: WalletsListEthereum,

      // Wagmi config args
      chains: chains.supportedChains,
      autoConnect: true,
      ssr: true,
      pollingInterval: PROVIDER_POLLING_INTERVAL,
      batch: {
        multicall: false,
      },

      // Wallets config args
      ...getDefaultWalletsModalConfig(),
      walletsPinned: WALLETS_PINNED,
      walletsShown: WALLETS_SHOWN,
    })
  }, [backendRPC, chains.defaultChain, chains.supportedChains])

  return (
    // default wagmi autoConnect, MUST be false in our case, because we use custom autoConnect from Reef Knot
    <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>
        <Web3LegacyProvider
          defaultChainId={chains.defaultChain.id}
          supportedChains={chains.supportedChains}
          wagmiConfig={wagmiConfig}
        >
          <ReefKnotProvider config={reefKnotConfig}>
            <ReefKnotWalletsModal
              config={walletsModalConfig}
              darkThemeEnabled={themeName === 'dark'}
            />
            {children}
          </ReefKnotProvider>
        </Web3LegacyProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
