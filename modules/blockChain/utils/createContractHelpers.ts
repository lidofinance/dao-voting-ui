import { CHAINS } from '../chains'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useGlobalMemo } from 'modules/shared/hooks/useGlobalMemo'

import type { Signer, providers } from 'ethers'
import type { JsonRpcSigner } from '@ethersproject/providers'
import { getStaticRpcBatchProvider } from './rpcProviders'
import { Address } from '../types'

type Library = JsonRpcSigner | Signer | providers.Provider

interface Factory {
  name: string
  connect(address: string, library: Library): unknown
}

type CreatorArgs<F> = {
  factory: F
  address: Address
  rpcUrl: string
}

type CallArgs = {
  library: Library
}

type CallRpcArgs = {
  chainId: CHAINS
  rpc: string
}

export function createContractHelpers<F extends Factory>({
  address,
  factory,
  rpcUrl,
}: CreatorArgs<F>) {
  type Instance = ReturnType<F['connect']>

  function connect({ library }: CallArgs) {
    return factory.connect(address, library) as Instance
  }

  function connectRpc({ chainId, rpc }: CallRpcArgs) {
    const library = getStaticRpcBatchProvider(chainId, rpc)
    return connect({ library })
  }

  function useInstanceRpc() {
    const { chainId, rpcProvider } = useWeb3()

    return useGlobalMemo(
      () => connect({ library: rpcProvider! }),
      `contract-rpc-${chainId}-${rpcUrl}-${address}`,
    )
  }

  function useInstanceWeb3() {
    const { web3Provider, isWalletConnected, walletAddress } = useWeb3()
    const { chainId } = useWeb3()

    return useGlobalMemo(
      () =>
        connect({
          // TODO: find a way to remove ! here
          library: web3Provider!,
        }),
      [
        'contract-web3-',
        isWalletConnected ? 'active' : 'inactive',
        web3Provider ? 'with-signer' : 'no-signer',
        chainId,
        address,
        walletAddress,
      ].join('-'),
    )
  }

  return {
    address,
    factory,
    connect,
    connectRpc,
    useRpc: useInstanceRpc,
    useWeb3: useInstanceWeb3,
  }
}
