import { useReducer } from 'react'

type Reducer<S extends object> = (p: S, n: Partial<S>) => S
const reducer: Reducer<any> = (p, n) => ({ ...p, ...n })

export function useSimpleReducer<S extends object>(initialState: S) {
  return useReducer(reducer as Reducer<S>, initialState)
}
