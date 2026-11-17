import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { pipelineStages } from '../data/skills'
import { SectionHeading } from '../components/SectionHeading'
import { PipelinePlayground } from '../components/PipelinePlayground'
import { ToolChip } from '../components/ToolChip'
import { cn } from '../utils/helpers'

/** Interactive Source → Ingest → Transform → Store → Serve pipeline. */
export function Skills() {
  const [hovered, setHovered] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string | null>(null)
  const active = pinned ?? hovered

  return (
    <section id="skills" className="section-pad relative overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-accent-cyan/10 blur-[130px]" />
      <div className="container-shell relative">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading index="04" eyebrow="Toolkit / how it flows" title={<>One pipeline, <span className="gradient-text">many stages.</span></>} />
          <p className="max-w-md text-sm leading-relaxed text-muted lg:text-right">
            Hover a stage to light up the tools I use there. This is how I think about a data problem — end to end.
          </p>
        </div>

        {/* flowing connector line */}
        <div className="relative mt-20">
          <div className="absolute left-0 right-0 top-[46px] hidden h-px bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-pink opacity-40 lg:block" />
          <motion.div
            className="absolute top-[44px] hidden h-2 w-2 rounded-full bg-accent-cyan shadow-[0_0_16px_#22d3ee] lg:block"
            animate={{ left: ['0%', '100%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            aria-hidden="true"
          />

          <div className="grid gap-6 lg:grid-cols-5 lg:gap-4">
            {pipelineStages.map((stage, i) => {
              const isActive = active === stage.id
              const dimmed = active !== null && !isActive
              return (
                <div key={stage.id} className="relative">
                  <motion.div
                    onMouseEnter={() => {
                      if (!pinned) setHovered(stage.id)
                    }}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => {
                      if (!pinned) setHovered(stage.id)
                    }}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) setHovered(null)
                    }}
                    onClick={() => setPinned((p) => (p === stage.id ? null : stage.id))}
                    onKeyDown={(e) => {
                      if (e.target !== e.currentTarget) return
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setPinned((p) => (p === stage.id ? null : stage.id))
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={pinned === stage.id}
                    aria-label={`${stage.label} stage — click to ${pinned === stage.id ? 'unpin' : 'pin and view tools'}`}
                    data-cursor="Open"
                    animate={{ scale: isActive ? 1.04 : 1, opacity: dimmed ? 0.45 : 1 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      'group relative h-full cursor-pointer rounded-2xl border p-5 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-accent-cyan',
                      isActive ? 'border-transparent bg-surface-2 shadow-[0_0_50px_-12px_rgba(139,92,246,.6)]' : 'border-line/50 bg-surface/60',
                    )}
                  >
                    {isActive && <span className="absolute inset-0 -z-10 rounded-2xl bg-accent-gradient opacity-10" />}
                    <div className="mb-5 flex items-center justify-between">
                      <span className="font-mono text-xs text-accent-cyan">{String(i + 1).padStart(2, '0')}</span>
                      <span className={cn('h-2.5 w-2.5 rounded-full transition-all', isActive ? 'bg-accent-pink shadow-[0_0_12px_#f472b6]' : 'bg-line')} />
                    </div>
                    <h3 className="font-display text-lg font-semibold">{stage.label}</h3>
                    {pinned === stage.id && (
                      <span className="mt-1 block font-mono text-[9px] uppercase tracking-widest text-accent-pink">pinned · tap to unpin</span>
                    )}
                    <p className="mt-2 min-h-[3rem] text-xs leading-relaxed text-muted">{stage.description}</p>
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {stage.skills.map((skill) => (
                        <ToolChip
                          key={skill}
                          name={skill}
                          compact
                          className={cn(
                            '!px-2.5 !py-1 !text-[10px]',
                            isActive ? 'border-accent-violet/60 bg-accent-violet/10 text-ink' : '',
                          )}
                        />
                      ))}
                    </div>
                  </motion.div>
                  {i < pipelineStages.length - 1 && (
                    <ArrowRight className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 text-accent-violet lg:block" size={18} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* closing note */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-xs text-muted">
          <span className="text-accent-cyan">Big Data</span>
          <span className="h-1 w-1 rounded-full bg-line" />
          <span>distributed processing</span>
          <span className="h-1 w-1 rounded-full bg-line" />
          <span className="text-accent-violet">cloud &amp; containers</span>
          <span className="h-1 w-1 rounded-full bg-line" />
          <span className="text-accent-pink">continuous learning</span>
        </div>

        <PipelinePlayground />
      </div>
    </section>
  )
}
