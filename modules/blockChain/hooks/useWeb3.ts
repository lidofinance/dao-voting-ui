import { useContext } from 'react'
import invariant from 'tiny-invariant'
import { Web3LegacyContext } from 'modules/web3Provider/web3LegacyProvider'

export const useWeb3 = () => {
  const value = useContext(Web3LegacyContext)
  invariant(value, 'useWeb3 was used outside the Web3LegacyContext provider')
  return value
}
