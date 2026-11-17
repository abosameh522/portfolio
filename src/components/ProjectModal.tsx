import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Github, X } from 'lucide-react'
import type { Project } from '../types'
import { projectArtSvg } from '../utils/helpers'
import { getLenis } from '../hooks/useLenis'
import { ScrollTrigger } from '../utils/gsap'
import { useModalPause } from '../context/ModalPauseContext'
import { ToolChip } from './ToolChip'

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

const PHASES: Array<{ key: 'problem' | 'approach' | 'result'; label: string }> = [
  { key: 'problem', label: 'Problem' },
  { key: 'approach', label: 'Approach' },
  { key: 'result', label: 'Result' },
]

const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])'

/** Detail dialog with a locked background, focus trap and shared-element art. */
export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const lastFocused = useRef<HTMLElement | null>(null)
  const savedY = useRef(0)
  const { setModalOpen } = useModalPause()

  useEffect(() => {
    if (!project) return

    const lenis = getLenis()
    savedY.current = window.scrollY
    lastFocused.current = document.activeElement as HTMLElement | null

    // 1. Stop Lenis + lock the document without a layout shift.
    lenis?.stop()
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    const previousOverflow = document.body.style.overflow
    const previousPadding = document.body.style.paddingRight
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`
    document.body.classList.add('modal-open')

    // 2. Pause every ScrollTrigger (including the pinned horizontal track).
    ScrollTrigger.getAll().forEach((trigger) => trigger.disable(false))
    setModalOpen(true)

    // 3. Focus the dialog and keep Tab inside it.
    const focusTimer = window.setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus()
    }, 40)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !dialogRef.current) return
      const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.getClientRects().length > 0,
      )
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)

    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', onKey)
      setModalOpen(false)

      // Restore the exact scroll position, then resume all animations.
      if (lenis) {
        lenis.scrollTo(savedY.current, { immediate: true, force: true })
        lenis.start()
      } else {
        window.scrollTo(0, savedY.current)
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.enable(false))
      requestAnimationFrame(() => ScrollTrigger.refresh())

      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPadding
      document.body.classList.remove('modal-open')

      lastFocused.current?.focus()
      // Clear any stale cursor label left over from a chip behind the dialog.
      document.dispatchEvent(new CustomEvent('portfolio:cursor-reset'))
    }
  }, [project, onClose, setModalOpen])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-md sm:p-6"
          style={{ overscrollBehavior: 'contain' }}
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            tabIndex={-1}
            className="relative my-4 w-full max-w-2xl overflow-hidden rounded-3xl border border-line/60 bg-surface shadow-2xl sm:my-8"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* preview — shares a layoutId with the card */}
            <motion.div
              layoutId={`project-art-${project.id}`}
              className="relative aspect-[16/7] w-full overflow-hidden bg-[#07070b]"
            >
              <img
                src={projectArtSvg(project.hue, project.art)}
                alt={`Abstract preview artwork for ${project.title}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-transparent to-transparent" />
              <button
                data-autofocus
                onClick={onClose}
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black"
                aria-label="Close project details"
                data-cursor="Close"
              >
                <X size={18} />
              </button>
            </motion.div>

            {/* header: title + always-visible GitHub button */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-1 sm:px-8">
              <div>
                <div className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
                  <span className="text-accent-cyan">{project.category}</span>
                  <span className="h-1 w-1 rounded-full bg-line" />
                  <span>{project.year}</span>
                </div>
                <h2 id="project-modal-title" className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  {project.title}
                </h2>
              </div>
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary !px-5 !py-2.5 text-xs sm:text-sm"
                  data-cursor="GitHub"
                >
                  <Github size={15} /> View on GitHub <ArrowUpRight size={14} />
                </a>
              ) : (
                <button disabled className="tag-chip cursor-not-allowed border-dashed opacity-60">
                  Repo coming soon
                </button>
              )}
            </div>

            <div className="px-6 pb-8 pt-5 sm:px-8">
              <p className="text-sm leading-relaxed text-ink/80 sm:text-base">{project.summary}</p>

              {/* compact problem / approach / result */}
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {PHASES.map((phase) => (
                  <div key={phase.key} className="relative rounded-xl border border-line/40 bg-surface-2/40 p-4">
                    <div className="mb-2 h-px w-8 bg-gradient-to-r from-accent-cyan to-accent-violet" />
                    <h3 className="mono-label mb-1.5 !text-[10px] !text-accent-cyan">{phase.label}</h3>
                    <p className="text-xs leading-relaxed text-muted">{project[phase.key]}</p>
                  </div>
                ))}
              </div>

              {/* metrics */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                {project.metrics.map((metric) => (
                  <div key={metric.label} className="rounded-xl border border-line/50 bg-surface-2/50 p-3">
                    <div className="font-mono text-base font-semibold text-ink sm:text-lg">{metric.value}</div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted">{metric.label}</div>
                  </div>
                ))}
              </div>

              {/* clickable tech chips */}
              <div className="mt-5 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <ToolChip key={tag} name={tag} compact />
                ))}
              </div>

              {/* repeat link at the bottom */}
              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line/40 pt-5">
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-xs text-accent-cyan underline decoration-line underline-offset-4 transition-colors hover:text-ink"
                    data-cursor="GitHub"
                  >
                    <Github size={14} /> View on GitHub <ArrowUpRight size={13} />
                  </a>
                ) : (
                  <span className="font-mono text-xs text-muted">Repo coming soon</span>
                )}
                <span className="inline-flex items-center rounded-full border border-dashed border-line/70 px-4 py-2 font-mono text-[11px] text-muted">
                  TODO: add demo / screenshots
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
