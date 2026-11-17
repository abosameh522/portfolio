import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

interface ModalPauseContextValue {
  modalOpen: boolean
  setModalOpen: (open: boolean) => void
}

const ModalPauseContext = createContext<ModalPauseContextValue>({
  modalOpen: false,
  setModalOpen: () => undefined,
})

/** Lets background effects pause while a project dialog is open. */
export function ModalPauseProvider({ children }: { children: ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false)
  const value = useMemo(() => ({ modalOpen, setModalOpen }), [modalOpen])
  return <ModalPauseContext.Provider value={value}>{children}</ModalPauseContext.Provider>
}

export function useModalPause() {
  return useContext(ModalPauseContext)
}
