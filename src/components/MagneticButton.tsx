import type { ReactNode } from 'react'
import { useMagnetic } from '../hooks/useMagnetic'
import { cn } from '../utils/helpers'

interface MagneticButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  className?: string
  /** Data attribute picked up by the custom cursor to show a contextual label. */
  cursorLabel?: string
  ariaLabel?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}

/**
 * A magnetic button that can render as an <a> or <button>. Ripple is handled
 * by CSS pseudo-elements in the primary variant.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  className,
  cursorLabel = 'Open',
  ariaLabel,
  type = 'button',
  disabled,
}: MagneticButtonProps) {
  const { ref, onPointerMove, onPointerLeave } = useMagnetic<HTMLElement>(0.3)

  const shared = {
    ref: ref as never,
    onPointerMove,
    onPointerLeave,
    'data-cursor': cursorLabel,
    'aria-label': ariaLabel,
    className: cn('btn-primary group', className),
    children: (
      <>
        <span className="relative z-10 flex items-center gap-2">{children}</span>
        <span className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,.35), transparent 55%)' }}
        />
      </>
    ),
  }

  if (href) {
    const external = href.startsWith('http') || href.startsWith('mailto:')
    return (
      <a
        {...shared}
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      />
    )
  }

  return <button {...shared} type={type} onClick={onClick} disabled={disabled} />
}
