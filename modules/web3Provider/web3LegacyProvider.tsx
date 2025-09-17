import { StaticJsonRpcBatchProvider } from 'modules/blockChain/utils/StaticJsonRpcBatchProvider'
import { createContext, useEffect, useState, useMemo } from 'react'
import { Config, useAccount, useConnections, useConnectorClient } from 'wagmi'
import { providers } from 'ethers' // ethers v5
import type { JsonRpcSigner } from '@ethersproject/providers'
import { useConfig } from 'modules/config/hooks/useConfig'
import { getStaticRpcBatchProvider } from 'modules/blockChain/utils/rpcProviders'
import { CHAINS } from 'modules/blockChain/chains'
import { Chain } from 'viem'
import type { Account, Client, Transport } from 'viem'

// Official wagmi adapter for ethers v5 (from wagmi docs)
export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, transport } = client

  const provider = new providers.Web3Provider(transport, 'any')
  const signer = provider.getSigner(account.address)
  return signer
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner(chainId: CHAINS) {
  const { data: client } = useConnectorClient({ chainId })
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client])
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

  const web3Provider = useEthersSigner(chainId)

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
