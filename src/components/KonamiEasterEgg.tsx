import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a']

/** Konami code (or typing "data") triggers a short matrix-rain overlay. */
export function KonamiEasterEgg() {
  const [active, setActive] = useState(false)
  const buffer = useRef<string[]>([])
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      buffer.current = [...buffer.current, key].slice(-12)
      const seq = buffer.current.join(',')
      const konamiHit = KONAMI.every((k, i) => buffer.current[buffer.current.length - KONAMI.length + i] === k)
      const dataHit = seq.endsWith('d,a,t,a')
      if (konamiHit || dataHit) {
        setActive(true)
        buffer.current = []
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [reduced])

  if (reduced) return null

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[110] bg-black/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => setActive(false)}
        >
          <MatrixRain onDone={() => setActive(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 grid place-items-center"
          >
            <div className="text-center font-mono">
              <div className="text-5xl font-bold text-[#22d3ee] drop-shadow-[0_0_24px_#22d3ee] sm:text-7xl">
                DATA MODE
              </div>
              <div className="mt-4 tracking-[0.4em] text-white/60">pipeline.override engaged_</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function MatrixRain({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    const glyphs = 'データアイ01パイプラインDATA<>{}[]0123456789'
    const fontSize = 16
    const columns = Math.floor(width / fontSize)
    const drops = Array.from({ length: columns }, () => Math.random() * -100)

    const resize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)

    let raf = 0
    const start = performance.now()
    const render = (now: number) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
      ctx.fillRect(0, 0, width, height)
      ctx.font = `${fontSize}px monospace`
      for (let i = 0; i < drops.length; i++) {
        const char = glyphs[Math.floor(Math.random() * glyphs.length)]
        ctx.fillStyle = Math.random() > 0.98 ? '#ffffff' : '#22d3ee'
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)
        if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }
      if (now - start < 5200) {
        raf = requestAnimationFrame(render)
      } else {
        onDone()
      }
    }
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [onDone])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-70" aria-hidden="true" />
}
