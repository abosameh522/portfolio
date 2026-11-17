import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { GraduationCap, FolderGit2, BookOpen, ExternalLink, ArrowUpRight } from 'lucide-react'
import { timeline } from '../data/skills'
import { projects } from '../data/projects'
import { SectionHeading } from '../components/SectionHeading'
import type { Project } from '../types'

const typeIcon = {
  education: GraduationCap,
  project: FolderGit2,
  learning: BookOpen,
}

const typeColor = {
  education: 'text-accent-cyan',
  project: 'text-accent-violet',
  learning: 'text-accent-pink',
}

export function Experience({ onOpenProject }: { onOpenProject: (project: Project) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 25%'] })
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="journey" className="section-pad relative">
      <div className="container-shell">
        <SectionHeading index="05" eyebrow="Journey / timeline" title={<>The road <span className="gradient-text">so far.</span></>} />

        <div ref={ref} className="relative mt-20 pl-8 sm:pl-12">
          {/* base line + drawn line */}
          <div className="absolute left-[11px] top-0 h-full w-px bg-line/40 sm:left-[19px]" />
          <motion.div
            style={{ scaleY: lineScale }}
            className="absolute left-[11px] top-0 h-full w-px origin-top bg-gradient-to-b from-accent-cyan via-accent-violet to-accent-pink shadow-[0_0_10px_rgba(139,92,246,.5)] sm:left-[19px]"
          />

          <div className="space-y-12 sm:space-y-16">
            {timeline.map((item, i) => {
              const Icon = typeIcon[item.type]
              const project = item.projectId ? projects.find((p) => p.id === item.projectId) : undefined
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.6, delay: (i % 2) * 0.05 }}
                  className="relative"
                >
                  <span className="absolute -left-8 top-1 grid h-6 w-6 place-items-center rounded-full border border-line/50 bg-surface sm:-left-12 sm:h-10 sm:w-10">
                    {/* mobile: plain glowing dot. desktop: coloured icon on top of a soft halo. */}
                    <span className="h-2.5 w-2.5 rounded-full bg-accent-violet shadow-[0_0_12px_#8b5cf6] sm:hidden" />
                    <span className="pointer-events-none absolute inset-0 hidden rounded-full bg-accent-violet/10 sm:block" />
                    <Icon size={15} strokeWidth={1.9} className={`${typeColor[item.type]} relative z-10 hidden sm:block`} />
                  </span>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
                    <span className="font-mono text-xs uppercase tracking-widest text-accent-cyan sm:w-40 sm:shrink-0">
                      {item.period}
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-semibold sm:text-2xl">{item.title}</h3>
                      {item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor="Official site"
                          className={`mt-1 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest transition-opacity hover:opacity-70 ${typeColor[item.type]}`}
                        >
                          {item.org} <ExternalLink size={11} />
                        </a>
                      ) : (
                        <div className={`mt-1 font-mono text-[11px] uppercase tracking-widest ${typeColor[item.type]}`}>
                          {item.org}
                        </div>
                      )}
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{item.description}</p>
                      {project && (
                        <button
                          onClick={() => onOpenProject(project)}
                          data-cursor="View"
                          className="mt-3 inline-flex items-center gap-2 rounded-full border border-line/50 px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted transition-colors hover:border-accent-cyan hover:text-accent-cyan"
                          aria-label={`Open ${project.title} case study`}
                        >
                          Open case study <ArrowUpRight size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
