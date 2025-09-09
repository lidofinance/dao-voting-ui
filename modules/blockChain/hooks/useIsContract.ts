import { Address, Hex } from 'viem'
import { useAccount, useBytecode } from 'wagmi'

const toBool = (data: Hex | undefined) => Boolean(data && data != '0x')

export const useIsContract = (address?: Address) => {
  const { address: accountAddress, chainId } = useAccount()

  const mergedAddress = address ?? accountAddress

  return useBytecode({
    address: mergedAddress,
    chainId,
    query: {
      enabled: !!mergedAddress,
      select: toBool,
    },
  })
}
