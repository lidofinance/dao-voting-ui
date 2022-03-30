import { ethers } from 'ethers'

export const weiToStr = (wei: ethers.BigNumberish) =>
  ethers.utils.formatEther(wei)

export const weiToNum = (wei: ethers.BigNumberish) => Number(weiToStr(wei))

export const strToWei = (str: string) => ethers.utils.parseEther(str)
