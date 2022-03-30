import type { BigNumberish } from 'ethers'

export async function estimateGasFallback(
  estimator: Promise<BigNumberish>,
  fallback: number = 650000,
) {
  try {
    const gasLimit = Number(await estimator)
    const multiplied = Math.round(gasLimit * 1.3)
    console.log(
      `Gas estimated ${gasLimit}. Using x1.3 value ${multiplied} for reliability`,
    )
    return multiplied
  } catch (err) {
    console.log(`Gas estimation failed, using fallback value: ${fallback}`, err)
    return fallback
  }
}
