import { useContext } from 'react'
import { configContext } from '../providers/configProvider'

export function useConfig() {
  return useContext(configContext)
}
