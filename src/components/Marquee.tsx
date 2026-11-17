import type { ReactNode } from 'react'
import { cn } from '../utils/helpers'

interface MarqueeProps {
  children: ReactNode
  className?: string
  slow?: boolean
  reverse?: boolean
  /** Pause the CSS animation (e.g. while a popover is open). */
  paused?: boolean
  /** Hide the whole strip from assistive tech (pure decoration). */
  ariaHidden?: boolean
  /** The second copy is visual-only; keep it out of the accessibility tree. */
  hideDuplicateFromA11y?: boolean
}

/** Seamless infinite marquee — render children twice and translate -50%. */
export function Marquee({
  children,
  className,
  slow,
  reverse,
  paused,
  ariaHidden = false,
  hideDuplicateFromA11y = true,
}: MarqueeProps) {
  return (
    <div className={cn('relative flex overflow-hidden', className)} aria-hidden={ariaHidden}>
      <div
        className={cn(
          'flex w-max shrink-0',
          slow ? 'animate-marquee-slow' : 'animate-marquee',
          reverse && '[animation-direction:reverse]',
        )}
        style={{ animationPlayState: paused ? 'paused' : 'running' }}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden={ariaHidden || hideDuplicateFromA11y}>
          {children}
        </div>
      </div>
    </div>
  )
}
