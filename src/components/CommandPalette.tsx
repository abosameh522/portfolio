import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, BookOpen, Check, Copy, FolderGit2, Github, Moon, Search, Sun } from 'lucide-react'
import { navItems, profile } from '../data/profile'
import { projects } from '../data/projects'
import { tools } from '../data/tools'
import type { Project } from '../types'

interface Action {
  id: string
  label: string
  group: string
  icon: React.ReactNode
  keywords: string
  run: () => void
}

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  theme: 'dark' | 'light'
  onToggleTheme: () => void
  onOpenProject: (project: Project) => void
}

/** Subsequence fuzzy match with a small relevance score. */
function fuzzyScore(query: string, text: string): number {
  const q = query.toLowerCase().trim()
  const t = text.toLowerCase()
  if (!q) return 1
  if (t.startsWith(q)) return 100 - t.length * 0.01
  const index = t.indexOf(q)
  if (index >= 0) return 60 - index
  let qi = 0
  let score = 0
  let streak = 0
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) {
      streak += 1
      score += 2 + streak
      qi += 1
    } else {
      streak = 0
    }
  }
  return qi === q.length ? score : 0
}

/** Ctrl/Cmd + K command palette for navigation and quick actions. */
export function CommandPalette({ open, onClose, theme, onToggleTheme, onOpenProject }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const go = (href: string) => {
    onClose()
    window.setTimeout(() => {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
      history.replaceState(null, '', href)
    }, 80)
  }

  const actions = useMemo<Action[]>(
    () => [
      ...navItems.map((item) => ({
        id: `nav-${item.href}`,
        label: item.label,
        group: 'Navigate',
        icon: <ArrowRight size={15} />,
        keywords: `${item.label} section ${item.index}`,
        run: () => go(item.href),
      })),
      ...projects.map((project) => ({
        id: `project-${project.id}`,
        label: project.title,
        group: 'Projects',
        icon: <FolderGit2 size={15} />,
        keywords: `${project.title} ${project.category} ${project.tags.join(' ')}`,
        run: () => {
          onClose()
          window.setTimeout(() => onOpenProject(project), 100)
        },
      })),
      ...projects
        .filter((project) => project.githubUrl)
        .map((project) => ({
          id: `repo-${project.id}`,
          label: `GitHub: ${project.title}`,
          group: 'Repositories',
          icon: <Github size={15} />,
          keywords: `github repository repo ${project.title}`,
          run: () => {
            window.open(project.githubUrl!, '_blank', 'noopener,noreferrer')
            onClose()
          },
        })),
      ...Object.entries(tools).map(([name, info]) => ({
        id: `docs-${name}`,
        label: `Docs: ${name}`,
        group: 'Documentation',
        icon: <BookOpen size={15} />,
        keywords: `docs documentation ${name} ${info.purpose}`,
        run: () => {
          window.open(info.docsUrl, '_blank', 'noopener,noreferrer')
          onClose()
        },
      })),
      {
        id: 'theme',
        label: theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
        group: 'Actions',
        icon: theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />,
        keywords: 'theme dark light toggle appearance',
        run: () => {
          onToggleTheme()
          onClose()
        },
      },
      {
        id: 'copy-email',
        label: 'Copy email address',
        group: 'Actions',
        icon: copied ? <Check size={15} /> : <Copy size={15} />,
        keywords: 'email copy contact address',
        run: () => {
          if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(profile.email).catch(() => undefined)
          }
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1800)
          onClose()
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme, copied, onClose, onToggleTheme, onOpenProject],
  )

  const results = useMemo(() => {
    return actions
      .map((action) => ({ action, score: fuzzyScore(query, `${action.label} ${action.keywords}`) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.action)
  }, [actions, query])

  useEffect(() => {
    setSelected(0)
  }, [query])

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelected(0)
      const t = window.setTimeout(() => inputRef.current?.focus(), 40)
      return () => window.clearTimeout(t)
    }
  }, [open])

  const execute = (action: Action | undefined) => {
    if (!action) return
    action.run()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected((s) => Math.min(s + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected((s) => Math.max(s - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      execute(results[selected])
    }
  }

  let lastGroup = ''

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[125] flex items-start justify-center bg-black/70 px-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-line/60 bg-surface/95 shadow-2xl backdrop-blur-xl"
            initial={{ opacity: 0, y: -18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-line/40 px-5 py-4">
              <Search size={18} className="shrink-0 text-accent-cyan" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to a section, project or action..."
                aria-label="Search commands"
                aria-controls="command-list"
                className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted/60"
              />
              <kbd className="rounded border border-line/60 px-2 py-1 font-mono text-[10px] text-muted">ESC</kbd>
            </div>

            <div id="command-list" role="listbox" aria-label="Command results" className="max-h-[52vh] overflow-y-auto p-2">
              {results.length === 0 && (
                <p className="px-4 py-8 text-center font-mono text-xs text-muted">No matches. Try “work”, “churn” or “theme”.</p>
              )}
              {results.map((action, i) => {
                const showGroup = action.group !== lastGroup
                lastGroup = action.group
                return (
                  <div key={action.id}>
                    {showGroup && <div className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-widest text-accent-violet">{action.group}</div>}
                    <button
                      role="option"
                      aria-selected={selected === i}
                      onMouseEnter={() => setSelected(i)}
                      onClick={() => execute(action)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                        selected === i ? 'bg-accent-violet/15 text-ink' : 'text-muted hover:bg-ink/5'
                      }`}
                    >
                      <span className={selected === i ? 'text-accent-cyan' : 'text-muted'}>{action.icon}</span>
                      <span className="flex-1 truncate">{action.label}</span>
                      {selected === i && <ArrowRight size={14} className="text-accent-cyan" />}
                    </button>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center gap-4 border-t border-line/40 px-5 py-3 font-mono text-[10px] text-muted">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span>esc close</span>
              <span className="ml-auto">{copied ? 'email copied!' : `${results.length} results`}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
