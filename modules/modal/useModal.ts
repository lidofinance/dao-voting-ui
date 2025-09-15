import { useContext, useMemo } from 'react'
import { modalContext } from './ModalProvider'
import type { ModalComponentType } from './ModalProvider'

export const useModal = <P extends object>(modal: ModalComponentType<P>) => {
  const { openModal, closeModal } = useContext(modalContext)

  return useMemo(
    () => ({
      openModal: (props?: P) => openModal(modal, props),
      closeModal: () => closeModal(modal),
    }),
    [modal, openModal, closeModal],
  )
}

export const getUseModal = <P extends object>(modal: ModalComponentType<P>) => {
  return () => useModal(modal)
}
