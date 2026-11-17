import type { ReactNode } from 'react'
import { cn } from '../utils/helpers'

interface SectionHeadingProps {
  index: string
  eyebrow: string
  title: ReactNode
  className?: string
  align?: 'left' | 'center'
}

/** Consistent section label: "02 / ABOUT" + a large display heading. */
export function SectionHeading({ index, eyebrow, title, className, align = 'left' }: SectionHeadingProps) {
  return (
    <div className={cn(align === 'center' && 'text-center', className)}>
      <div className={cn('mb-6 flex items-center gap-4', align === 'center' && 'justify-center')}>
        <span className="font-mono text-xs text-accent-cyan">{index} /</span>
        <span className="mono-label">{eyebrow}</span>
        <span className="h-px w-12 bg-gradient-to-r from-accent-violet to-transparent" />
      </div>
      <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
        {title}
      </h2>
    </div>
  )
}
