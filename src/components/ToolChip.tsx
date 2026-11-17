import { tools } from '../data/tools'
import { useInfoPopover } from '../context/PopoverContext'
import { cn } from '../utils/helpers'

interface ToolChipProps {
  name: string
  compact?: boolean
  className?: string
}

/** Any tech chip — opens a single shared popover with purpose + official docs. */
export function ToolChip({ name, compact, className }: ToolChipProps) {
  const { open } = useInfoPopover()
  const info = tools[name]

  return (
    <button
      type="button"
      data-cursor="Docs"
      aria-label={`Learn about ${name} and open its documentation`}
      onClick={(e) => {
        e.stopPropagation()
        open(
          {
            title: name,
            description: info?.purpose ?? `${name} is part of my data workflow.`,
            docsUrl: info?.docsUrl ?? 'https://developer.mozilla.org/',
          },
          e.currentTarget,
        )
      }}
      onKeyDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 font-mono tracking-wide transition-colors hover:border-accent-cyan hover:bg-surface-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-accent-cyan',
        compact ? 'text-[11px]' : 'text-[11px] sm:text-xs',
        'border-line/70 text-muted',
        className,
      )}
    >
      {name}
    </button>
  )
}
