import { memo, useMemo, useCallback, createContext, useRef } from 'react'
import type { ModalProps } from '@lidofinance/lido-ui'
import { useForceUpdate } from 'modules/shared/hooks/useForceUpdate'

export type Modal = React.ComponentType<ModalProps>

type ModalContextValue = {
  openModal: (modal: Modal) => void
}

export const modalContext = createContext({} as ModalContextValue)

type Props = {
  children?: React.ReactNode
}

function ModalProviderRaw({ children }: Props) {
  const stateRef = useRef(null as Modal | null)
  const update = useForceUpdate()

  const openModal = useCallback(
    (modal: Modal) => {
      stateRef.current = modal
      update()
    },
    [update],
  )

  const closeModal = useCallback(() => {
    // setTimeout helps to get rid of this error:
    // "Can't perform a react state update on an unmounted component"
    // after WalletConnect connection
    setTimeout(() => {
      stateRef.current = null
      update()
    }, 0)
  }, [update])

  const context = useMemo(
    () => ({
      openModal,
      closeModal,
    }),
    [openModal, closeModal],
  )

  return (
    <modalContext.Provider value={context}>
      {children}
      {stateRef.current && <stateRef.current open onClose={closeModal} />}
    </modalContext.Provider>
  )
}

export const ModalProvider = memo(ModalProviderRaw)
