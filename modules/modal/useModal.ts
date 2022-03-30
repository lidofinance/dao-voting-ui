import { useCallback, useContext } from 'react'
import { modalContext, Modal } from './ModalProvider'

export function useModal(modal: Modal) {
  const { openModal } = useContext(modalContext)
  return useCallback(() => openModal(modal), [openModal, modal])
}

export function getUseModal(modal: Modal) {
  return () => useModal(modal)
}
