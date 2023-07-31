import { useCallback, useContext } from 'react'
import { modalContext, Modal } from './ModalProvider'
import type { Data } from './ModalProvider'

export function useModal(modal: Modal, data?: Data) {
  const { openModal } = useContext(modalContext)
  return useCallback(() => openModal(modal, data), [openModal, modal, data])
}

export function getUseModal(modal: Modal) {
  return (data?: Data) => useModal(modal, data)
}
