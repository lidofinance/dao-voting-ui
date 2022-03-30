// https://github.com/CharlesStover/use-force-update
import { useCallback, useState } from 'react'

export function useForceUpdate() {
  const [, dispatch] = useState<{}>(Object.create(null))
  return useCallback(() => dispatch(Object.create(null)), [dispatch])
}
