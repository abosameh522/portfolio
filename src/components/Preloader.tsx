import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface PreloaderProps {
  onComplete: () => void
}

const BOOT_LINES = [
  '> initializing pipeline .................. OK',
  '> extracting source data ................. OK',
  '> transforming & cleaning records ........ OK',
  '> loading into warehouse ................. OK',
  '> validating schema ....................... OK',
]

/** Terminal-style boot sequence that reveals the site when finished. */
export function Preloader({ onComplete }: PreloaderProps) {
  const reduced = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const [show, setShow] = useState(true)

  useEffect(() => {
    if (reduced) {
      setProgress(100)
      const t = window.setTimeout(() => setShow(false), 120)
      return () => window.clearTimeout(t)
    }

    const interval = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          window.clearInterval(interval)
          return 100
        }
        return Math.min(100, p + Math.floor(Math.random() * 3) + 1)
      })
    }, 24)

    return () => window.clearInterval(interval)
  }, [reduced])

  useEffect(() => {
    if (progress < 100) return
    const t = window.setTimeout(() => setShow(false), 420)
    return () => window.clearTimeout(t)
  }, [progress])

  const visibleLines = BOOT_LINES.filter((_, i) => progress >= (i + 1) * 16)

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          className="fixed inset-0 z-[10002] flex flex-col items-center justify-center bg-bg px-6"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: reduced ? 0 : 0.9, ease: [0.76, 0, 0.24, 1] }}
          aria-label="Loading portfolio"
          role="status"
        >
          <div className="w-full max-w-lg font-mono text-sm sm:text-base">
            <div className="mb-8 flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-[#22d3ee] shadow-[0_0_12px_#22d3ee]" />
              <span className="h-3 w-3 rounded-full bg-[#8b5cf6] shadow-[0_0_12px_#8b5cf6]" />
              <span className="h-3 w-3 rounded-full bg-[#f472b6] shadow-[0_0_12px_#f472b6]" />
              <span className="ml-auto text-xs tracking-widest text-ink/40">pipeline.boot</span>
            </div>

            <div className="space-y-1.5 text-ink/75">
              {visibleLines.map((line, i) => (
                <motion.div
                  key={line}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <span className="text-[#22d3ee]">{i === visibleLines.length - 1 && progress < 100 ? '▌' : ' '}</span>
                  {line}
                </motion.div>
              ))}
              {progress >= 100 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-[#4ade80]">
                  ✔ ready — launching experience
                </motion.div>
              )}
            </div>

            <div className="mt-10">
              <div className="mb-2 flex justify-between text-xs text-muted">
                <span>LOADING</span>
                <span>{String(progress).padStart(3, '0')}%</span>
              </div>
              <div className="h-[3px] w-full overflow-hidden rounded-full bg-ink/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#22d3ee] via-[#8b5cf6] to-[#f472b6]"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'linear', duration: 0.1 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
