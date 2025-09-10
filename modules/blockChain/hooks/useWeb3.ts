import { useMemo } from 'react'
import { useConfig } from 'modules/config/hooks/useConfig'
import { parseChainId } from '../chains'
import { useAccount, useConfig as useWagmiConfig } from 'wagmi'
import { useSWR } from 'modules/network/hooks/useSwr'
import { type Config, getClient, getConnectorClient } from '@wagmi/core'
import { providers } from 'ethers'
import type { Client, Chain, Transport, Account } from 'viem'

function clientToSigner(client: Client<Transport, Chain, Account>) {
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

/** Action to convert a Viem Client to an ethers.js Signer. */
async function getEthersSigner(
  config: Config,
  { chainId }: { chainId?: number } = {},
) {
  const client = await getConnectorClient(config, { chainId })
  return clientToSigner(client)
}

function clientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  if (transport.type === 'fallback')
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<Transport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network),
      ),
    )
  return new providers.JsonRpcProvider(transport.url, network)
}

/** Action to convert a viem Public Client to an ethers.js Provider. */
function getEthersProvider(
  config: Config,
  { chainId }: { chainId?: number } = {},
) {
  const client = getClient(config, { chainId })
  if (!client) return
  return clientToProvider(client)
}

export function useWeb3() {
  const { chainId: accountChainId, isConnected, address } = useAccount()
  const { supportedChainIds } = useConfig()

  const { defaultChain } = useConfig()
  const wagmiConfig = useWagmiConfig()

  const chainId = useMemo(() => {
    if (!!accountChainId && supportedChainIds.includes(accountChainId)) {
      return parseChainId(accountChainId)
    }

    return defaultChain
  }, [accountChainId, defaultChain, supportedChainIds])

  const rpcProvider = useMemo(
    () => getEthersProvider(wagmiConfig, { chainId }),
    [wagmiConfig, chainId],
  )

  const { data: web3Provider } = useSWR(
    address ? `ethers-signer-${chainId}-${address}` : null,
    async () => getEthersSigner(wagmiConfig, { chainId }),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  return {
    isWalletConnected: isConnected,
    walletAddress: address,
    chainId,
    rpcProvider,
    web3Provider,
  }
}
