import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import { Zero } from '@ethersproject/constants'

export const formatBalance = (
  balance: BigNumber = Zero,
  maxDecimalDigits = 4,
) => {
  const balanceString = formatEther(balance)

  if (balanceString.includes('.')) {
    const parts = balanceString.split('.')
    return parts[0] + '.' + parts[1].slice(0, maxDecimalDigits)
  }

  return balanceString
}
