import type { UnpackedPromise } from '@lido-sdk/react/dist/esm/hooks/types'

export declare type AsyncMethodReturns<T, M extends keyof T> = T[M] extends (
  ...args: any
) => Promise<any>
  ? UnpackedPromise<ReturnType<T[M]>>
  : never

export declare type AsyncMethodParameters<T, M extends keyof T> = T[M] extends (
  ...args: any
) => Promise<any>
  ? Parameters<T[M]>
  : never
