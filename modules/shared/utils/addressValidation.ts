import { ethers } from 'ethers'

const regex = new RegExp('[-a-zA-Z0-9@._]{1,256}.eth')

export const isValidAddress = (
  address: string | null | undefined,
): address is string =>
  address?.length ? ethers.utils.isAddress(address) : false

export const isValidEns = (ens: string) => regex.test(ens)
