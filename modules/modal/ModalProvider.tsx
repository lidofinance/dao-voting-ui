import {
  memo,
  useMemo,
  useCallback,
  createContext,
  useRef,
  useState,
} from 'react'
import type { ModalProps } from '@lidofinance/lido-ui'

export type Modal = React.ComponentType<ModalProps>

export type Data = Record<string, any>

type ModalContextValue = {
  openModal: (modal: Modal, initialData?: Data) => void
  closeModal: () => void
}

// https://github.com/CharlesStover/use-force-update
const createNewEmptyObjectForForceUpdate = (): Data => ({})

export const modalContext = createContext({} as ModalContextValue)

type Props = {
  children?: React.ReactNode
}

function ModalProviderRaw({ children }: Props) {
  const stateRef = useRef<Modal | null>(null)
  const [data, setData] = useState<Data>(createNewEmptyObjectForForceUpdate())

  const openModal = useCallback(
    (modal: Modal, initialData?: Data) => {
      stateRef.current = modal
      if (initialData) {
        setData(initialData)
      } else {
        setData(createNewEmptyObjectForForceUpdate())
      }
    },
    [setData],
  )

  const closeModal = useCallback(() => {
    // setTimeout helps to get rid of this error:
    // "Can't perform a react state update on an unmounted component"
    // after WalletConnect connection
    setTimeout(() => {
      stateRef.current = null
      setData(createNewEmptyObjectForForceUpdate())
    }, 0)
  }, [setData])

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
      {stateRef.current && (
        <stateRef.current open onClose={closeModal} data={data} />
      )}
    </modalContext.Provider>
  )
}

export const ModalProvider = memo(ModalProviderRaw)
