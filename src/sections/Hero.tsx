import { lazy, Suspense, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, MapPin, Sparkles } from 'lucide-react'
import { profile } from '../data/profile'
import { MagneticButton } from '../components/MagneticButton'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useThemeMode } from '../hooks/useThemeMode'
import { useModalPause } from '../context/ModalPauseContext'

// Heavy 3D scene is code-split and loaded only after first paint.
const HeroScene = lazy(() => import('../components/HeroScene'))

/** Cycles through role strings with a typing effect. */
function useTypingRole(roles: readonly string[], active: boolean) {
  const [text, setText] = useState('')
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!active) return
    if (reduced) {
      setText(roles[0])
      return
    }
    let index = 0
    let charIndex = 0
    let deleting = false
    let timer = 0

    const tick = () => {
      const full = roles[index]
      if (!deleting) {
        charIndex++
        setText(full.slice(0, charIndex))
        if (charIndex === full.length) {
          deleting = true
          timer = window.setTimeout(tick, 1700)
        } else {
          timer = window.setTimeout(tick, 75)
        }
      } else {
        charIndex--
        setText(full.slice(0, charIndex))
        if (charIndex === 0) {
          deleting = false
          index = (index + 1) % roles.length
          timer = window.setTimeout(tick, 300)
        } else {
          timer = window.setTimeout(tick, 35)
        }
      }
    }
    timer = window.setTimeout(tick, 300)
    return () => window.clearTimeout(timer)
  }, [roles, active, reduced])

  return text
}

const letterVariants = {
  hidden: { y: '110%', opacity: 0, rotate: 8 },
  visible: (i: number) => ({
    y: '0%',
    opacity: 1,
    rotate: 0,
    transition: { delay: 0.1 + i * 0.045, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

interface HeroProps {
  ready: boolean
}

export function Hero({ ready }: HeroProps) {
  const role = useTypingRole(profile.roles, ready)
  const reduced = useReducedMotion()
  const small = useMediaQuery('(max-width: 768px)')
  const theme = useThemeMode()
  const light = theme === 'light'
  const { modalOpen } = useModalPause()
  const name = `${profile.firstName} ${profile.lastName}`
  const words = [profile.firstName, profile.lastName]

  return (
    <section id="home" className="relative min-h-screen overflow-hidden" aria-label="Introduction">
      {/* 3D data-stream background. Light theme gets a CSS "data grid" so the
          hero keeps the same energy without a dark canvas under a light page. */}
      <div className="absolute inset-0 opacity-90">
        {!reduced && !small && !light && (
          <Suspense fallback={<div className="h-full w-full bg-[radial-gradient(ellipse_at_center,rgb(var(--surface-2)),rgb(var(--bg))_70%)]" />}>
            <HeroScene paused={modalOpen} />
          </Suspense>
        )}
        {(small || light || reduced) && <div className="hero-canvas-light h-full w-full" />}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg" />

      <div className="container-shell relative z-10 flex min-h-screen flex-col justify-center pb-24 pt-28">
        {/* status pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8 flex flex-wrap items-center gap-3"
        >
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-muted">
            <Sparkles size={13} className="text-accent-cyan" />
            {profile.availability}
          </span>
          <span className="hidden items-center gap-2 font-mono text-[11px] text-muted sm:inline-flex">
            <MapPin size={13} className="text-accent-pink" /> {profile.location}
          </span>
        </motion.div>

        {/* giant name — per-letter kinetic reveal, grouped by word so lines
            never break mid-word. No trailing dots. */}
        <h1
          aria-label={name}
          className="flex flex-wrap font-display text-[clamp(3.5rem,13vw,11rem)] font-bold leading-[0.85] tracking-[-0.05em]"
        >
          {words.map((word, wi) => (
            <span key={word} className="flex shrink-0">
              {word.split('').map((char, ci) => {
                const i = wi * 7 + ci
                return (
                  <span key={ci} className="reveal-line">
                    <motion.span
                      className="reveal-word inline-block"
                      aria-hidden="true"
                      variants={letterVariants}
                      initial="hidden"
                      animate={ready ? 'visible' : 'hidden'}
                      custom={i}
                    >
                      {char}
                    </motion.span>
                  </span>
                )
              })}
              {wi < words.length - 1 && (
                <span className="reveal-line" aria-hidden="true">
                  <motion.span
                    className="reveal-word inline-block"
                    variants={letterVariants}
                    initial="hidden"
                    animate={ready ? 'visible' : 'hidden'}
                    custom={6}
                  >
                    &nbsp;
                  </motion.span>
                </span>
              )}
            </span>
          ))}
        </h1>

        {/* rotating subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-8 flex items-center gap-4 font-mono text-base sm:text-xl"
        >
          <span className="text-muted">I&apos;m a</span>
          <span className="min-w-[8ch] font-semibold text-transparent bg-accent-gradient bg-clip-text sm:min-w-[14ch]">
            {role}
            <span className="ml-0.5 inline-block animate-blink text-accent-cyan">|</span>
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.05, duration: 0.7 }}
          className="mt-6 max-w-xl text-sm leading-relaxed text-muted sm:text-base"
        >
          {profile.title} — turning raw, messy data into flowing pipelines, models and insight.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 0.7 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <MagneticButton href="#work" cursorLabel="Explore">
            View my work <ArrowDown size={17} className="transition-transform group-hover:translate-y-1" />
          </MagneticButton>
          {/* CV button removed until a CV file is ready */}
        </motion.div>

        {/* Flow rail — sets the "data moving through a pipeline" idea immediately
            and fills the lower register instead of leaving dead space. */}
        <motion.a
          href="#skills"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.35, duration: 0.7 }}
          data-cursor="Pipeline"
          aria-label="See the full data pipeline in the skills section"
          className="group relative mt-14 hidden max-w-3xl sm:mt-20 sm:block lg:max-w-4xl"
        >
          <div className="relative flex items-center justify-between">
            {/* base rail + travelling packet */}
            <span className="absolute left-0 right-0 top-[7px] h-px bg-line/60" aria-hidden="true" />
            <span
              className="absolute left-0 right-0 top-[7px] h-px bg-accent-gradient opacity-70"
              aria-hidden="true"
            />
            {!reduced && (
              <span className="hero-packet absolute top-[3px] h-[9px] w-[9px] -translate-x-1/2 rounded-full bg-accent-cyan shadow-[0_0_12px_#22d3ee]" aria-hidden="true" />
            )}
            {['Extract', 'Validate', 'Transform', 'Load', 'Serve'].map((stage, i) => (
              <span key={stage} className="relative flex flex-col items-center gap-3">
                <span className="h-[15px] w-[15px] rounded-full border border-line/70 bg-bg transition-colors duration-300 group-hover:border-accent-cyan" />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted transition-colors duration-300 group-hover:text-ink">
                  {stage}
                </span>
                <span className="sr-only">{`stage ${i + 1} of 5`}</span>
              </span>
            ))}
          </div>
        </motion.a>
      </div>

      {/* scroll indicator */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted"
        aria-label="Scroll to about section"
        data-cursor="Scroll"
      >
        scroll
        <span className="relative h-10 w-px overflow-hidden bg-line/60">
          <motion.span
            className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-accent-cyan to-transparent"
            animate={reduced ? {} : { y: ['-100%', '250%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.a>
    </section>
  )
}
