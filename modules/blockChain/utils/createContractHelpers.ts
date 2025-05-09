import { CHAINS } from '@lido-sdk/constants'

import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useGlobalMemo } from 'modules/shared/hooks/useGlobalMemo'

import type { Signer, providers } from 'ethers'
import type { JsonRpcSigner } from '@ethersproject/providers'
import { getStaticRpcBatchProvider } from '@lido-sdk/providers'
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
    const { chainId } = useWeb3()
    const library = getStaticRpcBatchProvider(chainId, rpcUrl)

    return useGlobalMemo(
      () => connect({ library }),
      `contract-rpc-${chainId}-${rpcUrl}-${address}`,
    )
  }

  function useInstanceWeb3() {
    const { library, active, account } = useWeb3()
    const { chainId } = useWeb3()

    return useGlobalMemo(
      () =>
        connect({
          // TODO: find a way to remove ! here
          library: library?.getSigner()!,
        }),
      [
        'contract-web3-',
        active ? 'active' : 'inactive',
        library ? 'with-signer' : 'no-signer',
        chainId,
        address,
        account,
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
