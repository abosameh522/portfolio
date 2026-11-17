import { useEffect, useState } from 'react'
import { Marquee } from './Marquee'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useInfoPopover } from '../context/PopoverContext'
import { useModalPause } from '../context/ModalPauseContext'
import { tickerMetrics } from '../data/tools'
import { random } from '../utils/helpers'

interface Stat {
  label: string
  value: number
  suffix: string
  kind: 'int' | 'percent'
}

const INITIAL: Stat[] = [
  { label: 'rows processed', value: 1_284_390, suffix: '', kind: 'int' },
  { label: 'jobs succeeded', value: 99.4, suffix: '%', kind: 'percent' },
  { label: 'pipeline uptime', value: 99.98, suffix: '%', kind: 'percent' },
  { label: 'packets in flight', value: 18, suffix: '', kind: 'int' },
]

/** Decorative live-system ticker — every metric opens an explainer popover.
 *  It reads as a status bar for the hero, so it retracts once the visitor
 *  scrolls into the content instead of hovering over section headings. */
export function LiveDataTicker() {
  const reduced = useReducedMotion()
  const { open, isOpen } = useInfoPopover()
  const { modalOpen } = useModalPause()
  const [stats, setStats] = useState(INITIAL)
  const [hovered, setHovered] = useState(false)
  const [retracted, setRetracted] = useState(false)
  const paused = hovered || isOpen || modalOpen

  useEffect(() => {
    const onScroll = () => setRetracted(window.scrollY > 120)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (reduced || paused) return
    const interval = window.setInterval(() => {
      setStats((prev) =>
        prev.map((stat) => {
          switch (stat.label) {
            case 'rows processed':
              return { ...stat, value: stat.value + Math.floor(random(80, 420)) }
            case 'jobs succeeded':
              return { ...stat, value: Math.min(99.9, Math.max(98.8, stat.value + random(-0.15, 0.15))) }
            case 'pipeline uptime':
              return { ...stat, value: Math.min(99.99, Math.max(99.9, stat.value + random(-0.01, 0.01))) }
            default:
              return { ...stat, value: Math.floor(random(8, 38)) }
          }
        }),
      )
    }, 2200)
    return () => window.clearInterval(interval)
  }, [reduced, paused])

  const format = (stat: Stat) =>
    stat.kind === 'int' ? Math.round(stat.value).toLocaleString('en-US') : stat.value.toFixed(2)

  return (
    <div
      className={`fixed inset-x-0 top-[72px] z-[88] flex h-8 items-center border-y border-line/30 bg-[rgb(var(--bg)/0.82)] backdrop-blur-md transition-[transform,opacity] duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
        retracted ? 'pointer-events-none -translate-y-[120%] opacity-0' : 'translate-y-0 opacity-100'
      }`}
      aria-hidden={retracted || undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute left-0 top-0 z-10 flex h-full items-center gap-1.5 bg-accent-violet px-3 font-mono text-[9px] font-bold uppercase tracking-widest text-white">
        <span className={`h-1.5 w-1.5 rounded-full bg-white ${reduced || paused ? '' : 'animate-pulse'}`} />
        demo
      </div>
      <div className="w-full overflow-hidden pl-16 sm:pl-20">
        <Marquee slow paused={paused}>
          {Array.from({ length: 3 }, (_, repeat) => (
            <div key={repeat} className="flex shrink-0 items-center">
              {stats.map((stat) => {
                const info = tickerMetrics[stat.label]
                return (
                  <button
                    key={`${repeat}-${stat.label}`}
                    type="button"
                    data-cursor="Info"
                    aria-label={`What ${stat.label} means in a real pipeline`}
                    aria-hidden={repeat > 0 ? true : undefined}
                    tabIndex={repeat > 0 || retracted ? -1 : 0}
                    onClick={(e) =>
                      open(
                        {
                          title: info?.title ?? stat.label,
                          description: info?.description ?? 'A simulated pipeline metric.',
                          docsUrl: info?.docsUrl ?? 'https://airflow.apache.org/docs/',
                          note: 'Simulated data — decorative demo, not a live system.',
                        },
                        e.currentTarget,
                      )
                    }
                    className="flex items-center gap-2 px-5 font-mono text-[10px] uppercase tracking-wider text-muted transition-colors hover:text-ink"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_#22d3ee]" />
                    <span>{stat.label}</span>
                    <span className="font-semibold text-accent-cyan">{format(stat)}{stat.suffix}</span>
                  </button>
                )
              })}
            </div>
          ))}
        </Marquee>
      </div>
      <span className="sr-only">Decorative demo statistics — simulated data, not live values.</span>
    </div>
  )
}
