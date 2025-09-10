import { Hex } from 'viem'
import { useAccount, useBytecode } from 'wagmi'

const toBool = (data: Hex | undefined) => Boolean(data && data != '0x')

export const useIsContract = () => {
  const { address, chainId } = useAccount()

  return useBytecode({
    address,
    chainId,
    query: {
      enabled: !!address,
      select: toBool,
    },
  })
}
