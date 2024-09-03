import { createContext, FC, useCallback, useContext, useState } from 'react'
import invariant from 'tiny-invariant'

//
// Data context
//

type Value = {
  selectedPublicDelegate: string | undefined
  onPublicDelegateSelect: (address: string) => () => void
  onPublicDelegateReset: () => void
}

const DelegateFromPublicListContext = createContext<Value | null>(null)

export const useDelegateFromPublicList = () => {
  const value = useContext(DelegateFromPublicListContext)
  invariant(
    value,
    'useDelegateFromPublicList was used outside the DelegateFromPublicListContext provider',
  )
  return value
}

export const DelegateFromPublicListProvider: FC = ({ children }) => {
  const [selectedPublicDelegate, setSelectedPublicDelegate] = useState<string>()

  const handleDelegatePick = useCallback(
    (address: string) => () => {
      setSelectedPublicDelegate(address)
    },
    [],
  )

  const handleDelegateReset = useCallback(() => {
    setSelectedPublicDelegate(undefined)
  }, [])

  return (
    <DelegateFromPublicListContext.Provider
      value={{
        selectedPublicDelegate,
        onPublicDelegateSelect: handleDelegatePick,
        onPublicDelegateReset: handleDelegateReset,
      }}
    >
      {children}
    </DelegateFromPublicListContext.Provider>
  )
}
