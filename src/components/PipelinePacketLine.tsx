import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { navItems } from '../data/profile'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useModalPause } from '../context/ModalPauseContext'

const NODE_LABELS = ['EXTRACT', 'PROFILE', 'TRANSFORM', 'VALIDATE', 'LOAD', 'TRANSMIT']
const COLORS = ['#22d3ee', '#8b5cf6', '#f472b6']

/**
 * Vertical "pipeline" running down the side of the page. A glowing data
 * packet travels along it as the visitor scrolls and each section node
 * lights up with a tiny stage label when reached. Desktop only.
 */
export function PipelinePacketLine() {
  const reduced = useReducedMotion()
  const { modalOpen } = useModalPause()
  const { scrollYProgress } = useScroll()
  const top = useTransform(scrollYProgress, (v) => `${Math.min(100, Math.max(0, v * 100))}%`)
  const [positions, setPositions] = useState<number[]>([])
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)

  useEffect(() => {
    const measure = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const next = navItems.map((item) => {
        const el = document.querySelector(item.href)
        if (!el) return 0
        const rect = el.getBoundingClientRect()
        const center = rect.top + window.scrollY + rect.height / 2 - window.innerHeight / 2
        return Math.min(100, Math.max(0, (center / max) * 100))
      })
      setPositions(next)
    }
    measure()
    window.addEventListener('resize', measure)
    const t = window.setTimeout(measure, 1200)
    return () => {
      window.removeEventListener('resize', measure)
      window.clearTimeout(t)
    }
  }, [])

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (modalOpen) return
    let next = 0
    positions.forEach((pos, i) => {
      if (value * 100 >= pos - 2) next = i
    })
    if (next !== activeRef.current) {
      activeRef.current = next
      setActive(next)
    }
  })

  if (reduced) return null

  return (
    <div
      className={`pointer-events-none fixed left-5 top-0 z-[80] hidden h-screen w-8 transition-opacity duration-300 lg:block xl:left-8 ${modalOpen ? 'opacity-0' : 'opacity-100'}`}
      aria-hidden="true"
    >
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-line/60 to-transparent" />
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-accent-cyan via-accent-violet to-accent-pink opacity-25" />

      {/* travelling packet */}
      <motion.div
        className="absolute left-1/2 z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 bg-accent-cyan shadow-[0_0_14px_3px_rgba(34,211,238,.8)]"
        style={{ top }}
        animate={{ borderRadius: ['2px', '50%', '2px'] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* section nodes */}
      {navItems.map((item, i) => (
        <div
          key={item.href}
          className="absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2"
          style={{ top: `${positions[i] ?? i * 16}%` }}
        >
          <span
            className={`block h-2 w-2 rounded-full border transition-all duration-500 ${
              active === i ? 'scale-150 border-transparent shadow-[0_0_12px_3px_rgba(139,92,246,.7)]' : 'border-line bg-surface'
            }`}
            style={active === i ? { background: COLORS[i % COLORS.length] } : undefined}
          />
          <span
            className={`font-mono text-[8px] uppercase tracking-[0.18em] transition-all duration-500 ${
              active === i ? 'translate-x-0 text-white opacity-100' : '-translate-x-1 text-muted opacity-0'
            }`}
          >
            {NODE_LABELS[i]}
          </span>
        </div>
      ))}
    </div>
  )
}
