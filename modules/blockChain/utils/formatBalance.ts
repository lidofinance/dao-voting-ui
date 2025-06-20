import { weiToNum } from './parseWei'
import { BigNumberish } from 'ethers'

const defaultFormatter = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumSignificantDigits: 3,
})

export const formatBalance = (
  amount: BigNumberish,
  maximumFractionDigits?: number,
) => {
  if (maximumFractionDigits !== undefined) {
    const customFormatter = new Intl.NumberFormat('en', {
      notation: 'compact',
      maximumFractionDigits,
    })
    return customFormatter.format(weiToNum(amount))
  }

  return defaultFormatter.format(weiToNum(amount))
}
