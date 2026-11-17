import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { allTools } from '../data/skills'
import { projects } from '../data/projects'
import { profile } from '../data/profile'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { cn } from '../utils/helpers'

type LineKind = 'input' | 'output' | 'system' | 'success' | 'error'
interface Line {
  id: number
  kind: LineKind
  text: string
}

const COMMANDS = ['help', 'whoami', 'skills', 'projects', 'contact', 'clear', 'sudo hire ahmed']

const kindColor: Record<LineKind, string> = {
  input: 'text-accent-cyan',
  output: 'text-muted',
  system: 'text-accent-violet',
  success: 'text-green-400',
  error: 'text-accent-pink',
}

let lineId = 0
const makeLine = (kind: LineKind, text: string): Line => ({ id: ++lineId, kind, text })

/** A realistic, keyboard-driven terminal with command history and autocomplete. */
export function InteractiveTerminal() {
  const hostRef = useRef<HTMLDivElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const inView = useInView(hostRef, { once: true, margin: '-15%' })
  const started = useRef(false)
  const reduced = useReducedMotion()

  const [lines, setLines] = useState<Line[]>([])
  const [intro, setIntro] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState<number | null>(null)
  const [hired, setHired] = useState(false)

  // Auto-play a short typed intro the first time the terminal scrolls into view.
  useEffect(() => {
    if (!inView || started.current) return
    started.current = true
    const full = "pipeline-terminal v1.0 — type 'help' to begin_"
    let i = 0
    const timer = window.setInterval(() => {
      i += 1
      setIntro(full.slice(0, i))
      if (i >= full.length) {
        window.clearInterval(timer)
        setIntro(null)
        setLines([
          makeLine('system', 'session established · node: nile-delta-01'),
          makeLine('output', 'Available commands: help, whoami, skills, projects, contact, clear.'),
        ])
      }
    }, 28)
    return () => window.clearInterval(timer)
  }, [inView])

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight
  }, [lines, intro])

  const run = (raw: string) => {
    const value = raw.trim()
    if (!value) return
    const cmd = value.toLowerCase()
    setHistory((h) => [...h, value])
    setHistIdx(null)

    if (cmd === 'clear') {
      setLines([])
      setInput('')
      return
    }

    const responses: Line[] = [makeLine('input', `visitor@pipeline:~$ ${value}`)]

    switch (cmd) {
      case 'help':
        responses.push(makeLine('output', 'COMMANDS'))
        COMMANDS.forEach((c) => responses.push(makeLine('output', `  ${c.padEnd(18)} ${describe(c)}`)))
        responses.push(makeLine('system', 'Tip: ↑/↓ for history, Tab to autocomplete.'))
        break
      case 'whoami':
        responses.push(makeLine('success', `${profile.name} — ${profile.title}`))
        responses.push(makeLine('output', `B.Sc. CS & AI, Mansoura University · ${profile.location}`))
        responses.push(makeLine('output', `Contact: ${profile.email}`))
        break
      case 'skills':
        responses.push(makeLine('output', allTools.join(' · ')))
        break
      case 'projects':
        projects.forEach((p, i) => responses.push(makeLine('output', `${String(i + 1).padStart(2, '0')}. ${p.title} [${p.category}]`)))
        break
      case 'contact':
        responses.push(makeLine('success', `Email: ${profile.email}`))
        responses.push(makeLine('output', 'GitHub: https://github.com/abosameh522'))
        responses.push(makeLine('output', 'LinkedIn: https://www.linkedin.com/in/ahmed-sameh-283927414'))
        break
      case 'sudo hire ahmed':
        responses.push(makeLine('system', 'verifying credentials ...'))
        responses.push(makeLine('success', 'ACCESS GRANTED ✓ — offer letter queued in the pipeline 🎉'))
        responses.push(makeLine('output', 'Seriously though — email me and let\'s talk.'))
        if (!reduced) {
          setHired(true)
          window.setTimeout(() => setHired(false), 3200)
        } else {
          setHired(true)
          window.setTimeout(() => setHired(false), 1500)
        }
        break
      default:
        responses.push(makeLine('error', `command not found: ${value}. Try 'help'.`))
    }

    setLines((prev) => [...prev, ...responses])
    setInput('')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      run(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!history.length) return
      const next = histIdx === null ? history.length - 1 : Math.max(0, histIdx - 1)
      setHistIdx(next)
      setInput(history[next])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (histIdx === null) return
      const next = histIdx + 1
      if (next >= history.length) {
        setHistIdx(null)
        setInput('')
      } else {
        setHistIdx(next)
        setInput(history[next])
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const match = COMMANDS.find((c) => c.startsWith(input.trim().toLowerCase()) && input.trim())
      if (match) setInput(match)
    }
  }

  const particles = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 520,
        y: -60 - Math.random() * 260,
        rot: Math.random() * 720 - 360,
        color: ['#22d3ee', '#8b5cf6', '#f472b6', '#4ade80'][i % 4],
        delay: Math.random() * 0.3,
      })),
    [hired],
  )

  return (
    <div ref={hostRef} className="relative mt-12 overflow-hidden rounded-2xl border border-line/50 bg-[#08080d] shadow-2xl">
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-line/40 bg-white/[0.03] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#f472b6]/80" />
        <span className="h-3 w-3 rounded-full bg-[#8b5cf6]/80" />
        <span className="h-3 w-3 rounded-full bg-[#22d3ee]/80" />
        <span className="ml-3 font-mono text-[11px] text-muted">ahmed@pipeline: ~/portfolio</span>
        <button
          onClick={() => inputRef.current?.focus()}
          className="ml-auto font-mono text-[10px] text-muted transition-colors hover:text-accent-cyan"
          aria-label="Focus terminal input"
          data-cursor="Focus"
        >
          click to focus ⌨
        </button>
      </div>

      {/* output */}
      <div
        ref={outputRef}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
        className="h-64 space-y-1 overflow-y-auto px-4 py-4 font-mono text-[12px] leading-relaxed sm:h-72 sm:text-[13px]"
        onClick={() => inputRef.current?.focus()}
      >
        {intro !== null && (
          <div className="text-accent-cyan">
            <span className="text-accent-violet">›</span> {intro}
            <span className="ml-0.5 inline-block animate-blink">▌</span>
          </div>
        )}
        {lines.map((line) => (
          <motion.div key={line.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className={cn('whitespace-pre-wrap break-words', kindColor[line.kind])}>
            {line.text}
          </motion.div>
        ))}
        {intro === null && lines.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              inputRef.current?.focus()
            }}
            className="flex w-full text-left text-accent-cyan"
            aria-label="Focus terminal input"
          >
            <span className="text-accent-violet">visitor@pipeline</span>:<span className="text-accent-cyan">~$</span>
            <span className="ml-2 inline-block h-4 w-1.5 animate-blink bg-accent-cyan" />
          </button>
        )}
      </div>

      {/* input row */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          run(input)
        }}
        className="flex items-center gap-2 border-t border-line/40 bg-white/[0.02] px-4 py-3 font-mono text-[12px] sm:text-[13px]"
      >
        <span className="shrink-0 text-accent-violet">visitor@pipeline:~$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Terminal command input"
          autoComplete="off"
          spellCheck={false}
          placeholder="type a command..."
          className="min-w-0 flex-1 bg-transparent text-accent-cyan outline-none placeholder:text-muted/50"
        />
      </form>

      {/* tap-friendly command suggestions for visitors without a keyboard */}
      <div className="flex flex-wrap items-center gap-2 border-t border-line/40 bg-white/[0.02] px-4 py-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">try:</span>
        {['help', 'whoami', 'skills', 'projects', 'contact'].map((cmd) => (
          <button
            key={cmd}
            onClick={() => {
              run(cmd)
              inputRef.current?.focus()
            }}
            data-cursor="Run"
            aria-label={`Run terminal command ${cmd}`}
            className="rounded-full border border-line/50 px-3 py-1 font-mono text-[10px] text-accent-cyan transition-colors hover:border-accent-cyan hover:bg-accent-cyan/10"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* confetti */}
      <AnimatePresence>
        {hired && (
          <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
            {particles.map((p) => (
              <motion.span
                key={p.id}
                className="absolute left-1/2 top-1/2 h-2 w-2 rounded-sm"
                style={{ background: p.color }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
                animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.6, rotate: p.rot }}
                transition={{ duration: 2.2, delay: p.delay, ease: 'easeOut' }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function describe(cmd: string): string {
  switch (cmd) {
    case 'help':
      return 'show this list'
    case 'whoami':
      return 'who I am'
    case 'skills':
      return 'list my toolkit'
    case 'projects':
      return 'list my work'
    case 'contact':
      return 'how to reach me'
    case 'clear':
      return 'clear the screen'
    default:
      return 'a little surprise'
  }
}
