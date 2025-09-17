import { StaticJsonRpcBatchProvider } from 'modules/blockChain/utils/StaticJsonRpcBatchProvider'
import { createContext, useEffect, useState } from 'react'
import { Config, useAccount, useConnections } from 'wagmi'
import { JsonRpcSigner } from '@ethersproject/providers'
import { useConfig } from 'modules/config/hooks/useConfig'
import { getStaticRpcBatchProvider } from 'modules/blockChain/utils/rpcProviders'
import { useSWR } from 'modules/network/hooks/useSwr'
import { getConnectorClient } from '@wagmi/core'
import { providers } from 'ethers'
import { CHAINS } from 'modules/blockChain/chains'
import { Chain } from 'viem'

/** Action to convert a Viem Client to an ethers.js Signer. */
async function getEthersSigner(
  config: Config,
  { chainId }: { chainId?: number } = {},
) {
  const client = await getConnectorClient(config, { chainId })
  const { account, chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new providers.Web3Provider(transport, network)
  const signer = provider.getSigner(account.address)
  return signer
}

type Value = {
  walletAddress: string | undefined
  isWalletConnected: boolean
  chainId: CHAINS
  rpcProvider: StaticJsonRpcBatchProvider
  web3Provider: JsonRpcSigner | undefined
}

export const Web3LegacyContext = createContext<Value | null>(null)

type ProviderProps = {
  children: React.ReactNode
  defaultChainId: CHAINS
  wagmiConfig: Config
  supportedChains: Chain[]
}

export const Web3LegacyProvider = ({
  children,
  defaultChainId,
  wagmiConfig,
  supportedChains,
}: ProviderProps) => {
  const { address: walletAddress, isConnected } = useAccount()
  const [chainId, setChainId] = useState(defaultChainId)
  const { getRpcUrl } = useConfig()
  const [rpcProvider, setRpcProvider] = useState<StaticJsonRpcBatchProvider>(
    getStaticRpcBatchProvider(defaultChainId, getRpcUrl(defaultChainId)),
  )

  const { data: web3Provider } = useSWR(
    walletAddress ? `ethers-signer-${chainId}-${walletAddress}` : null,
    async () => getEthersSigner(wagmiConfig, { chainId }),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  const [activeConnection] = useConnections({ config: wagmiConfig })

  useEffect(() => {
    // Could be undefined
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!activeConnection && chainId !== defaultChainId) {
      setChainId(defaultChainId)
      setRpcProvider(
        getStaticRpcBatchProvider(defaultChainId, getRpcUrl(defaultChainId)),
      )
      return
      // Could be undefined
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    } else if (!activeConnection) {
      return
    }

    if (
      activeConnection.chainId !== chainId &&
      supportedChains.find(c => c.id === activeConnection.chainId)
    ) {
      setChainId(activeConnection.chainId)
      setRpcProvider(
        getStaticRpcBatchProvider(
          activeConnection.chainId,
          getRpcUrl(activeConnection.chainId),
        ),
      )
    }

    // No need to trigger on other changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConnection])

  return (
    <Web3LegacyContext.Provider
      value={{
        walletAddress,
        isWalletConnected: isConnected,
        chainId,
        rpcProvider,
        web3Provider,
      }}
    >
      {children}
    </Web3LegacyContext.Provider>
  )
}
