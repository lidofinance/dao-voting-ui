import { useMemo, createContext } from 'react'
import { parseEnvConfig } from '../utils/parseEnvConfig'
import { EnvConfig, Config } from '../types'

export const configContext = createContext({} as Config)

type Props = {
  envConfig: EnvConfig
  children?: React.ReactNode
}

export function ConfigProvider({ children, envConfig }: Props) {
  const value = useMemo(() => parseEnvConfig(envConfig), [envConfig])
  return <configContext.Provider value={value} children={children} />
}
