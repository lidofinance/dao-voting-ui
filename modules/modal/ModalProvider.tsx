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
    stateRef.current = null
    update()
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
