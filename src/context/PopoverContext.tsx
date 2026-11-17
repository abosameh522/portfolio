import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, X } from 'lucide-react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { clamp } from '../utils/helpers'

export interface PopoverInfo {
  title: string
  /** One or two plain-English lines. */
  description: string
  docsUrl: string
  note?: string
}

interface PopoverContextValue {
  open: (info: PopoverInfo, trigger: HTMLElement) => void
  close: () => void
  isOpen: boolean
}

const PopoverContext = createContext<PopoverContextValue>({
  open: () => undefined,
  close: () => undefined,
  isOpen: false,
})

interface PopoverState {
  info: PopoverInfo
  trigger: HTMLElement
}

/** Single, shared info popover: floating card on desktop, bottom sheet on mobile. */
export function PopoverProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PopoverState | null>(null)
  const [pos, setPos] = useState({ left: 12, top: 12 })
  const stateRef = useRef<PopoverState | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const small = useMediaQuery('(max-width: 640px)')
  stateRef.current = state

  const close = useCallback(() => {
    const trigger = stateRef.current?.trigger
    setState(null)
    window.setTimeout(() => trigger?.focus(), 0)
  }, [])

  const open = useCallback((info: PopoverInfo, trigger: HTMLElement) => {
    // Replacing the state automatically closes any previously open popover.
    setState({ info, trigger })
  }, [])

  useEffect(() => {
    if (!state) return
    const update = () => {
      const rect = state.trigger.getBoundingClientRect()
      const width = Math.min(340, window.innerWidth - 24)
      const left = clamp(rect.left, 12, Math.max(12, window.innerWidth - width - 12))
      const estimatedHeight = 210
      const below = rect.bottom + 10
      const top =
        below + estimatedHeight > window.innerHeight
          ? Math.max(12, rect.top - estimatedHeight - 10)
          : below
      setPos({ left, top })
    }
    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [state])

  useEffect(() => {
    if (!state) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      }
    }
    document.addEventListener('keydown', onKey)
    const t = window.setTimeout(() => closeButtonRef.current?.focus(), 60)
    return () => {
      document.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
    }
  }, [state, close])

  const value = useMemo(() => ({ open, close, isOpen: state !== null }), [open, close, state])

  return (
    <PopoverContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {state && (
          <>
            <motion.div
              className="fixed inset-0 z-[122]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              aria-hidden="true"
            />
            <motion.div
              role="dialog"
              aria-label={`About ${state.info.title}`}
              className={
                small
                  ? 'glass fixed inset-x-3 bottom-3 z-[123] rounded-2xl p-5 shadow-2xl'
                  : 'glass fixed z-[123] w-[340px] rounded-2xl p-4 shadow-2xl'
              }
              style={small ? undefined : { left: pos.left, top: pos.top }}
              initial={{ opacity: 0, y: small ? 24 : 8, scale: small ? 1 : 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: small ? 16 : 4, scale: small ? 1 : 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <h4 className="font-display text-lg font-semibold leading-tight">{state.info.title}</h4>
                <button
                  ref={closeButtonRef}
                  onClick={close}
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line/50 text-muted transition-colors hover:text-white"
                  aria-label="Close info popover"
                  data-cursor="Close"
                >
                  <X size={14} />
                </button>
              </div>
              <p className="whitespace-pre-line text-xs leading-relaxed text-muted">{state.info.description}</p>
              {state.info.note && (
                <p className="mt-2 font-mono text-[10px] text-accent-pink">{state.info.note}</p>
              )}
              <a
                href={state.info.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent-cyan/50 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-accent-cyan transition-colors hover:bg-accent-cyan/10"
                data-cursor="Docs"
              >
                Official docs <ExternalLink size={13} />
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PopoverContext.Provider>
  )
}

export function useInfoPopover() {
  return useContext(PopoverContext)
}
