import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Github } from 'lucide-react'
import type { Project } from '../types'
import { projectArtSvg } from '../utils/helpers'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { SpotlightLayer } from './SpotlightLayer'
import { ToolChip } from './ToolChip'

interface ProjectCardProps {
  project: Project
  index: number
  onOpen: (project: Project) => void
}

/** Interactive project card with pointer-driven 3D tilt and generated art. */
export function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const art = projectArtSvg(project.hue, project.art)

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    cardRef.current.style.transform = `perspective(1000px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg) translateY(-6px)`
    cardRef.current.style.setProperty('--mx', `${(px + 0.5) * 100}%`)
    cardRef.current.style.setProperty('--my', `${(py + 0.5) * 100}%`)
  }

  const handleLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateY(0)'
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      role="button"
      tabIndex={0}
      onClick={(e) => {
        // Focus the card so the dialog can return focus here on close,
        // without scrolling the page underneath it.
        e.currentTarget.focus({ preventScroll: true })
        onOpen(project)
      }}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(project)
        }
      }}
      data-cursor="View"
      aria-label={`Open details for ${project.title}`}
      className="spotlight-host group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-line/50 bg-surface/70 backdrop-blur-sm transition-[transform,border-color,box-shadow] duration-300 ease-out hover:border-transparent hover:shadow-[0_24px_80px_-20px_rgba(0,0,0,.7)] focus-visible:outline-2 focus-visible:outline-accent-cyan"
      style={{ transformStyle: 'preserve-3d', willChange: 'transform', '--mx': '50%', '--my': '50%' } as React.CSSProperties}
    >
      {/* cursor-following spotlight reveals a hidden circuit grid */}
      <SpotlightLayer hue={project.hue} />

      {/* generated preview art */}
      <motion.div
        layoutId={`project-art-${project.id}`}
        className="relative aspect-[16/9] w-full overflow-hidden border-b border-line/40 bg-[#07070b]"
      >
        <img
          src={art}
          alt={`Abstract preview artwork for ${project.title}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070b]/70 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/50 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white/80 backdrop-blur-sm">
          {project.category}
        </span>
        <span className="absolute right-4 top-4 font-mono text-[11px] text-white/60">{project.year}</span>
        <span className="absolute bottom-4 right-4 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-white text-[#07070b] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={18} />
        </span>
      </motion.div>

      {/* body */}
      <div className="relative z-20 flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
          <span className="text-accent-violet">{String(index + 1).padStart(2, '0')}</span>
          <span className="h-px flex-1 bg-line/50" />
        </div>
        <h3 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">{project.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{project.summary}</p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 4).map((tag) => (
            <ToolChip key={tag} name={tag} compact />
          ))}
          {project.tags.length > 4 && <span className="tag-chip">+{project.tags.length - 4}</span>}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="font-mono text-xs text-accent-cyan">View case study →</span>
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              data-cursor="GitHub"
              className="text-muted transition-colors hover:text-ink"
              aria-label={`View ${project.title} on GitHub`}
            >
              <Github size={17} />
            </a>
          ) : (
            <button
              disabled
              onClick={(e) => e.stopPropagation()}
              className="tag-chip cursor-not-allowed border-dashed opacity-60"
              aria-label="Repository coming soon"
            >
              Repo coming soon
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
