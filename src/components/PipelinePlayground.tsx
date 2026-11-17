import { useEffect, useRef, useState } from 'react'
import { RotateCcw, GripVertical } from 'lucide-react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { ToolChip } from './ToolChip'
import { cn } from '../utils/helpers'

const STAGES = ['Source', 'Ingest', 'Transform', 'Store', 'Serve']
const INITIAL_TRAY = ['Transform', 'Source', 'Store', 'Ingest', 'Serve']

type DropZone = { kind: 'tray' } | { kind: 'slot'; index: number }

const COLORS = ['#22d3ee', '#8b5cf6', '#f472b6', '#4ade80', '#a78bfa']

/** Touch-friendly drag-and-drop ordering game with a success flow animation. */
export function PipelinePlayground() {
  const reduced = useReducedMotion()
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null, null, null])
  const [tray, setTray] = useState<string[]>(INITIAL_TRAY)
  const [selected, setSelected] = useState<string | null>(null)
  const [ghost, setGhost] = useState<{ name: string; x: number; y: number } | null>(null)
  const [status, setStatus] = useState<'idle' | 'success' | 'wrong'>('idle')
  const [message, setMessage] = useState('Drag or tap the blocks into the right order.')
  const suppressClick = useRef(false)
  const wrongTimer = useRef(0)

  useEffect(() => () => window.clearTimeout(wrongTimer.current), [])

  const evaluate = (next: (string | null)[]) => {
    window.clearTimeout(wrongTimer.current)
    if (next.every(Boolean)) {
      if (next.every((stage, i) => stage === STAGES[i])) {
        setStatus('success')
        setMessage('Pipeline online ✓ — data is flowing end to end!')
      } else {
        setStatus('wrong')
        setMessage('Not quite — double-check the flow order.')
        wrongTimer.current = window.setTimeout(() => setStatus('idle'), 1800)
      }
    } else {
      setStatus('idle')
      setMessage('Drag or tap the blocks into the right order.')
    }
  }

  const place = (name: string, zone: DropZone) => {
    const nextSlots = [...slots]
    let nextTray = [...tray]
    const fromSlot = nextSlots.indexOf(name)
    if (fromSlot >= 0) nextSlots[fromSlot] = null
    else nextTray = nextTray.filter((item) => item !== name)

    if (zone.kind === 'tray') {
      if (!nextTray.includes(name)) nextTray.push(name)
    } else {
      const occupant = nextSlots[zone.index]
      if (occupant) {
        if (fromSlot >= 0) nextSlots[fromSlot] = occupant
        else nextTray.push(occupant)
      }
      nextSlots[zone.index] = name
    }

    setSlots(nextSlots)
    setTray(nextTray)
    setSelected(null)
    evaluate(nextSlots)
  }

  // Pointer listeners while dragging — one implementation covers mouse + touch.
  useEffect(() => {
    if (!ghost) return
    const move = (e: PointerEvent) => setGhost((g) => (g ? { ...g, x: e.clientX, y: e.clientY } : g))
    const up = (e: PointerEvent) => {
      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
      const drop = target?.closest<HTMLElement>('[data-drop]')
      if (drop) {
        const value = drop.dataset.drop ?? ''
        if (value === 'tray') place(ghost.name, { kind: 'tray' })
        else if (value.startsWith('slot-')) place(ghost.name, { kind: 'slot', index: Number(value.slice(5)) })
        suppressClick.current = true
        window.setTimeout(() => {
          suppressClick.current = false
        }, 140)
      }
      setGhost(null)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ghost, slots, tray])

  const startDrag = (e: React.PointerEvent, name: string) => {
    if (e.button !== undefined && e.button !== 0) return
    setSelected(name)
    setGhost({ name, x: e.clientX, y: e.clientY })
  }

  const reset = () => {
    setSlots([null, null, null, null, null])
    setTray(INITIAL_TRAY)
    setSelected(null)
    setStatus('idle')
    setMessage('Drag or tap the blocks into the right order.')
  }

  return (
    <div className="mt-20 rounded-3xl border border-line/50 bg-surface/50 p-5 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mono-label mb-2">// interactive sandbox</div>
          <h3 className="font-display text-2xl font-semibold sm:text-3xl">Build your pipeline</h3>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Put the stages in the right order: <span className="text-accent-cyan">Source → Ingest → Transform → Store → Serve</span>.
          </p>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-full border border-line/50 px-4 py-2 font-mono text-[11px] text-muted transition-colors hover:border-accent-cyan hover:text-accent-cyan"
          data-cursor="Reset"
          aria-label="Reset playground"
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      <div className={cn('playground-inner', status === 'wrong' && !reduced && 'playground-shake')}>
        {/* slots */}
        <div className="flex flex-wrap items-stretch gap-2 sm:gap-3" aria-label="Pipeline slots">
          {slots.map((stage, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-3">
              <div
                role="button"
                tabIndex={0}
                data-drop={`slot-${i}`}
                onClick={() => {
                  if (suppressClick.current) return
                  if (selected) place(selected, { kind: 'slot', index: i })
                }}
                onKeyDown={(e) => {
                  if (e.target !== e.currentTarget) return
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    if (selected) place(selected, { kind: 'slot', index: i })
                  }
                }}
                aria-label={`Pipeline slot ${i + 1}${stage ? ` containing ${stage}` : ', empty'}`}
                className={cn(
                  'relative flex h-20 w-[76px] flex-col items-center justify-center gap-1 rounded-xl border text-center font-mono text-[11px] transition-colors sm:w-24',
                  stage ? 'border-transparent text-ink' : 'border-dashed border-line/60 text-muted hover:border-accent-cyan',
                  status === 'success' && stage && 'pipeline-block-success',
                )}
                style={stage ? { background: `linear-gradient(140deg, ${COLORS[i]}44, ${COLORS[i]}18)` } : undefined}
              >
                <span className="text-[9px] text-ink/50">{String(i + 1).padStart(2, '0')}</span>
                {stage ? (
                  <span className="relative z-10 flex items-center gap-1">
                    <GripVertical size={11} className="opacity-50" />
                    {status === 'success' ? (
                      <ToolChip name={stage} compact className="!px-1.5 !py-0.5 !text-[9px]" />
                    ) : (
                      <span
                        className="flex cursor-grab items-center active:cursor-grabbing"
                        onPointerDown={(e) => startDrag(e, stage)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            setSelected(stage)
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`${stage} block, selected for placement`}
                      >
                        {stage}
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="text-[10px] opacity-60">drop</span>
                )}
                {status === 'success' && stage && !reduced && <span className="flow-dot" style={{ background: COLORS[i] }} />}
              </div>
              {i < STAGES.length - 1 && (
                <span className="hidden h-px w-3 bg-gradient-to-r from-accent-cyan to-accent-violet sm:block" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>

        {/* tray */}
        <div
          data-drop="tray"
          className="mt-8 min-h-[76px] rounded-2xl border border-line/40 bg-bg/40 p-3"
          aria-label="Block tray"
        >
          <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted">blocks / {tray.length} remaining</div>
          <div className="flex flex-wrap gap-2">
            {tray.map((stage) => (
              <button
                key={stage}
                onPointerDown={(e) => startDrag(e, stage)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelected(stage)
                  }
                }}
                onClick={() => {
                  if (suppressClick.current) return
                  setSelected(stage)
                }}
                aria-pressed={selected === stage}
                aria-label={`${stage} block. Select to place in a slot.`}
                className={cn(
                  'flex h-11 cursor-grab items-center gap-1.5 rounded-lg border px-3 font-mono text-[11px] text-ink transition-all active:cursor-grabbing',
                  selected === stage ? 'scale-105 border-transparent ring-2 ring-accent-cyan' : 'border-line/50 hover:border-accent-violet',
                )}
                style={{ background: `linear-gradient(140deg, ${COLORS[STAGES.indexOf(stage)]}33, transparent)` }}
              >
                <GripVertical size={12} className="opacity-50" />
                {stage}
              </button>
            ))}
            {tray.length === 0 && <span className="font-mono text-[11px] text-muted">all blocks placed — reset to try again</span>}
          </div>
        </div>

        <p
          role="status"
          aria-live="polite"
          className={cn(
            'mt-5 font-mono text-xs',
            status === 'success' ? 'text-green-400' : status === 'wrong' ? 'text-accent-pink' : 'text-muted',
          )}
        >
          {status === 'success' ? '✓ ' : status === 'wrong' ? '✕ ' : '› '}{message}
        </p>
      </div>

      {/* drag ghost */}
      {ghost && !reduced && (
        <div
          className="pointer-events-none fixed z-[130] flex h-11 items-center gap-1.5 rounded-lg border border-accent-cyan bg-surface px-3 font-mono text-[11px] text-white shadow-[0_0_30px_rgba(34,211,238,.5)]"
          style={{ left: ghost.x + 12, top: ghost.y + 12 }}
          aria-hidden="true"
        >
          <GripVertical size={12} className="opacity-50" />
          {ghost.name}
        </div>
      )}
    </div>
  )
}
