import { weiToNum } from './parseWei'
import { BigNumberish } from 'ethers'

const formatter = Intl.NumberFormat('en', {
  notation: 'compact',
  maximumSignificantDigits: 3,
})

export const formatBalance = (amount: BigNumberish) => {
  return formatter.format(weiToNum(amount))
}
