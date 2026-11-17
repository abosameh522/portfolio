import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { projects, projectFilters, type ProjectFilter } from '../data/projects'
import { SectionHeading } from '../components/SectionHeading'
import { ProjectCard } from '../components/ProjectCard'
import { ProjectModal } from '../components/ProjectModal'
import { gsap, ScrollTrigger } from '../utils/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { isLowPowerDevice, cn } from '../utils/helpers'
import type { Project } from '../types'

interface ProjectsProps {
  selected: Project | null
  onSelect: (project: Project | null) => void
}

export function Projects({ selected, onSelect }: ProjectsProps) {
  const [filter, setFilter] = useState<ProjectFilter>('All')
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const small = useMediaQuery('(max-width: 900px)')
  const horizontal = !reduced && !small && !isLowPowerDevice()

  const visible = useMemo(
    () => (filter === 'All' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  )
  const closeModal = useCallback(() => onSelect(null), [onSelect])

  // Pinned horizontal scroll — rebuilt whenever the visible set changes.
  useEffect(() => {
    if (!horizontal || !pinRef.current || !trackRef.current) return

    const ctx = gsap.context(() => {
      const track = trackRef.current!
      // Subtract the trailing padding so the last card's right edge lands at
      // the viewport edge — no dead space, no cut-off card.
      const distance = () => {
        const rightPad = parseFloat(getComputedStyle(track).paddingRight) || 0
        return Math.max(1, track.scrollWidth - window.innerWidth - rightPad)
      }
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pinRef.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })
    }, pinRef)

    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => {
      cancelAnimationFrame(refresh)
      ctx.revert()
    }
  }, [horizontal, visible])

  return (
    <section id="work" className="relative">
      <div className="container-shell section-pad pb-16">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading index="03" eyebrow="Selected work / projects" title={<>Things I&apos;ve <span className="gradient-text">built &amp; shipped.</span></>} />
          <p className="max-w-md text-sm leading-relaxed text-muted lg:text-right">
            A selection of pipelines and models. Hover to explore, click to open the full case study.
          </p>
        </div>

        {/* filter bar */}
        <div className="mt-12 flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
          {projectFilters.map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              aria-pressed={filter === item}
              data-cursor="Filter"
              className={cn(
                'relative rounded-full border px-5 py-2 font-mono text-xs uppercase tracking-widest transition-colors',
                filter === item ? 'border-transparent text-white' : 'border-line/60 text-muted hover:text-white',
              )}
            >
              {filter === item && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-accent-gradient"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* project layout */}
      {horizontal ? (
        <div ref={pinRef} className="relative flex h-screen items-center overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-bg to-transparent" />
          <div ref={trackRef} className="flex w-max gap-8 px-[max(2rem,calc((100vw-1400px)/2+3.5rem))] will-change-transform">
            <div className="flex w-[42vw] max-w-[520px] shrink-0 flex-col justify-center pr-8">
              <span className="mono-label mb-4">{String(visible.length).padStart(2, '0')} projects / {filter}</span>
              <p className="font-display text-4xl font-bold leading-tight tracking-tight">
                Scroll to move through the <span className="gradient-text">pipeline</span>.
              </p>
              <div className="mt-6 flex items-center gap-2 font-mono text-xs text-muted">
                <ArrowRight size={15} className="text-accent-cyan" /> keep scrolling
              </div>
            </div>
            <AnimatePresence mode="popLayout">
              {visible.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="w-[70vw] max-w-[520px] shrink-0"
                >
                  <ProjectCard project={project} index={i} onOpen={onSelect} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-bg to-transparent" />
        </div>
      ) : (
        <div className="container-shell pb-16">
          <motion.div layout className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visible.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35 }}
                >
                  <ProjectCard project={project} index={i} onOpen={onSelect} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      <ProjectModal project={selected} onClose={closeModal} />
    </section>
  )
}
