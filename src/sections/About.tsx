import { useEffect, useRef, useState, type ComponentType } from 'react'
import { motion } from 'framer-motion'
import {
  Boxes, Brain, Database, GitBranch, Terminal, Workflow, Activity, Layers, Cpu,
} from 'lucide-react'
import { profile } from '../data/profile'
import { allTools } from '../data/skills'
import { projects } from '../data/projects'
import { SectionHeading } from '../components/SectionHeading'
import { Marquee } from '../components/Marquee'
import { InteractiveTerminal } from '../components/InteractiveTerminal'
import { ToolChip } from '../components/ToolChip'
import { useReducedMotion } from '../hooks/useReducedMotion'

const toolIcons: ComponentType<{ size?: number; className?: string }>[] = [
  Terminal, Database, Layers, Workflow, Boxes, Activity, Database, Brain, GitBranch, Cpu, Terminal, Layers,
]

function Counter({
  value,
  label,
  suffix = '',
  href,
}: {
  value: number
  label: string
  suffix?: string
  href: string
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const reduced = useReducedMotion()
  const [seen, setSeen] = useState(false)
  const display = useSafeCount(seen, value, reduced)

  /**
   * Reveal the counter once it is genuinely on screen. We observe the whole
   * anchor (not the inline number) and keep a scroll fallback so the value
   * can never stay stuck at 00 on exotic viewports / IO edge cases.
   */
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let revealed = false
    const reveal = () => {
      if (revealed) return
      revealed = true
      setSeen(true)
    }
    const onScreen = () => {
      const rect = el.getBoundingClientRect()
      return rect.top < window.innerHeight * 0.92 && rect.bottom > 0
    }

    if (typeof IntersectionObserver === 'undefined') {
      reveal()
      return
    }
    if (onScreen()) {
      reveal()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          reveal()
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(el)

    const onScroll = () => {
      if (onScreen()) {
        reveal()
        observer.disconnect()
        window.removeEventListener('scroll', onScroll)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <a
      ref={ref}
      href={href}
      data-cursor="Jump"
      aria-label={`${label}: ${value}${suffix} — jump to section`}
      className="group block rounded-lg text-center transition-opacity hover:opacity-80 sm:text-left"
    >
      <div className="font-display text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
        <span className="gradient-text">{String(display).padStart(2, '0')}</span>
        <span className="text-accent-pink">{suffix}</span>
      </div>
      <div className="mono-label mt-2 !text-[10px] !tracking-[0.14em] group-hover:text-accent-cyan sm:!text-xs sm:!tracking-[0.25em]">{label} ↗</div>
    </a>
  )
}

/** Small rAF counter that always lands exactly on `target`. */
function useSafeCount(run: boolean, target: number, reduced: boolean) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (!run) return
    if (reduced) {
      setDisplay(target)
      return
    }
    let frame = 0
    const start = performance.now()
    const duration = 1100
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      if (p >= 1) {
        setDisplay(target)
        return
      }
      setDisplay(Math.round(target * (1 - Math.pow(1 - p, 3))))
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [run, target, reduced])
  return display
}

export function About() {
  return (
    <section id="about" className="section-pad relative overflow-hidden">
      <div className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-accent-violet/10 blur-[120px]" />
      <div className="container-shell relative">
        <SectionHeading index="02" eyebrow="About / who I am" title={<>Building systems that <span className="gradient-text">move data forward.</span></>} />

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          {/* story */}
          <div>
            <p className="text-lg leading-relaxed text-ink/85 sm:text-xl">
              {profile.story}
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted sm:text-base">
              My toolkit spans the whole pipeline — from <span className="text-accent-cyan">Python &amp; SQL</span> at the source, through
              <span className="text-accent-violet"> Spark, Airflow &amp; Docker</span> in the middle, to
              <span className="text-accent-pink"> scikit-learn and fast APIs</span> at the end. I care about clean code,
              reproducible runs and results you can actually trust.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4 border-y border-line/40 py-8">
              <Counter value={projects.length} label="Projects built" href="#work" />
              <Counter value={3} label="Years studying" suffix="+" href="#journey" />
              <Counter value={allTools.length} label="Tools used" href="#skills" />
            </div>

            <div className="mt-8 grid gap-4 font-mono text-xs text-muted sm:grid-cols-2">
              <div><span className="text-accent-cyan">// education</span><br />{profile.education.degree}<br /><span className="text-muted/70">{profile.education.school}</span><br /><span>{profile.education.period}</span></div>
              <div><span className="text-accent-violet">// languages</span><br />{profile.languages.join(' · ')}<br /><span className="mt-2 block text-accent-pink">// based in</span>{profile.location}</div>
            </div>
          </div>

          {/* portrait / identity card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.7 }}
            className="relative mx-auto w-full max-w-md lg:mx-0"
          >
            <div className="glass relative aspect-[4/5] overflow-hidden rounded-3xl p-2">
              <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[linear-gradient(145deg,rgba(34,211,238,.12),rgba(139,92,246,.1),rgba(244,114,182,.1))]">
                {profile.photo ? (
                  <img src={profile.photo} alt={profile.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                    <div className="grid h-28 w-28 place-items-center rounded-full bg-accent-gradient font-display text-4xl font-bold text-white shadow-[0_0_60px_rgba(139,92,246,.5)]">
                      {profile.initials}
                    </div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted">TODO: add your photo</p>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
                  <div className="font-display text-2xl font-bold text-white">{profile.name}</div>
                  <div className="font-mono text-xs text-white/70">{profile.title}</div>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 -top-4 rounded-xl border border-line/50 bg-surface px-4 py-3 font-mono text-[10px] text-muted shadow-xl">
              <span className="text-accent-cyan">status:</span> available_for_work
            </div>
          </motion.div>
        </div>

        {/* interactive terminal */}
        <div className="mt-24">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="mono-label">// say hello to the shell</span>
            <span className="h-px flex-1 bg-gradient-to-r from-accent-violet to-transparent" />
          </div>
          <InteractiveTerminal />
        </div>
      </div>

      {/* infinite tech marquee */}
      <div className="mt-24 border-y border-line/30 py-6">
        <Marquee>
          {allTools.map((tool, i) => {
            const Icon = toolIcons[i % toolIcons.length]
            return (
              <div key={tool} className="flex items-center gap-3 px-6 font-mono text-sm text-muted">
                <Icon size={20} className="text-accent-violet" />
                <ToolChip name={tool} className="whitespace-nowrap" />
                <span className="ml-6 h-1 w-1 rounded-full bg-line" />
              </div>
            )
          })}
        </Marquee>
      </div>
    </section>
  )
}
