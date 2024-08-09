import { BigNumber } from 'ethers'

export const SNAPSHOT_LIDO_SPACE_NAME =
  '0x6c69646f2d736e617073686f742e657468000000000000000000000000000000' // lido-snapshot.eth

export const DELEGATORS_PAGE_SIZE = 2 //10
export const DELEGATORS_FETCH_SIZE = 5 //50
export const DELEGATORS_FETCH_TOTAL = 10 //200
export const VP_MIN_TO_SHOW = BigNumber.from(10).pow(16)
