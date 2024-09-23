import { useContext, useMemo } from 'react'
import { modalContext, Modal } from './ModalProvider'
import type { Data } from './ModalProvider'

export function useModal(modal: Modal, data?: Data) {
  const { openModal, closeModal } = useContext(modalContext)

  return useMemo(
    () => ({
      openModal: (props?: any) => openModal(modal, { ...data, ...props }),
      closeModal,
    }),
    [closeModal, openModal, modal, data],
  )
}

export function getUseModal(modal: Modal) {
  return (data?: Data) => useModal(modal, data)
}
