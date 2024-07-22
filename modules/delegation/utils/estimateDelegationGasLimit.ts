import { BigNumber } from 'ethers'

const GAS_LIMIT_FALLBACK = 150000
const EXTRA_GAS_TRANSACTION_RATIO = 1.05
const PRECISION = 10 ** 6

const applyGasLimitRatio = (gasLimit: BigNumber): BigNumber =>
  gasLimit.mul(EXTRA_GAS_TRANSACTION_RATIO * PRECISION).div(PRECISION)

export async function estimateDelegationGasLimit(
  estimator: Promise<BigNumber>,
  fallback: number = GAS_LIMIT_FALLBACK,
) {
  try {
    const gasLimit = await estimator
    const multiplied = applyGasLimitRatio(gasLimit)
    console.log(
      `Gas estimated ${gasLimit}. Using x1.3 value ${multiplied} for reliability`,
    )
    return multiplied
  } catch (err) {
    console.log(`Gas estimation failed, using fallback value: ${fallback}`, err)
    return fallback
  }
}
