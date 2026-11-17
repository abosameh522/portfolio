import { cn } from '../utils/helpers'
import { useModalPause } from '../context/ModalPauseContext'

/**
 * Cursor-following spotlight that reveals a hidden circuit grid underneath.
 * The host must set --mx / --my (percentages) on pointer move and carry the
 * `spotlight-host` class so the layer fades in on hover.
 */
export function SpotlightLayer({ hue = 190, className }: { hue?: number; className?: string }) {
  const { modalOpen } = useModalPause()
  return (
    <div
      className={cn('spotlight-layer pointer-events-none absolute inset-0 z-[5] overflow-hidden rounded-[inherit]', className)}
      style={{ '--spot-hue': hue, ...(modalOpen ? { opacity: 0 } : {}) } as React.CSSProperties}
      aria-hidden="true"
    >
      <div className="spotlight-grid absolute inset-0" />
      <div className="spotlight-glow absolute inset-0" />
    </div>
  )
}
