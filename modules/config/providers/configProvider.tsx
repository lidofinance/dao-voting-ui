import { useLocalStorage } from '@lido-sdk/react'
import { useState, useCallback, createContext } from 'react'

import { CHAINS } from '@lido-sdk/constants'
import { EnvConfigParsed } from '../types'
import { STORAGE_KEY_SAVED_SETTINGS } from 'modules/config/storage'

type SavedConfig = {
  rpcUrls: Partial<Record<CHAINS, string>>
  etherscanApiKey: string
  useBundledAbi: boolean
}

type ConfigContext = EnvConfigParsed & {
  savedConfig: SavedConfig
  setSavedConfig: React.Dispatch<React.SetStateAction<SavedConfig>>
}

export const configContext = createContext({} as ConfigContext)

type Props = {
  envConfig: EnvConfigParsed
  children?: React.ReactNode
}

const DEFAULT_STATE = {
  rpcUrls: {},
  etherscanApiKey: '',
  useBundledAbi: true,
}

export function ConfigProvider({ children, envConfig }: Props) {
  const [restoredSettings, setLocalStorage] = useLocalStorage(
    STORAGE_KEY_SAVED_SETTINGS,
    DEFAULT_STATE,
  )

  const [savedConfig, setSavedConfig] = useState<SavedConfig>(restoredSettings)

  const setSavedConfigAndRemember = useCallback(
    (config: SavedConfig) => {
      setLocalStorage(config)
      setSavedConfig(config)
    },
    [setLocalStorage],
  )

  return (
    <configContext.Provider
      value={{
        ...envConfig,
        savedConfig,
        setSavedConfig: setSavedConfigAndRemember,
      }}
      children={children}
    />
  )
}
