import { AppProps } from 'next/app'
import { ConfigProvider } from 'modules/config/providers/configProvider'

export type FilterMethods<T> = {
  [K in keyof T]: T[K] extends (...args: any) => any ? K : never
}[keyof T]

export type UnpackedPromise<T> = T extends Promise<infer U> ? U : T

export type KeyFromValue<V, T extends Record<PropertyKey, PropertyKey>> = {
  [K in keyof T]: V extends T[K] ? K : never
}[keyof T]

export type Invert<T extends Record<PropertyKey, PropertyKey>> = {
  [V in T[keyof T]]: KeyFromValue<V, T>
}

export type CustomAppProps = AppProps & {
  envConfig: React.ComponentProps<typeof ConfigProvider>['envConfig']
}

export type CustomApp = (props: CustomAppProps) => JSX.Element
