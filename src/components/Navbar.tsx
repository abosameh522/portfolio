import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { navItems, profile } from '../data/profile'
import { TextScramble } from './TextScramble'
import { cn } from '../utils/helpers'

interface NavbarProps {
  theme: 'dark' | 'light'
  onToggleTheme: () => void
  onNavigate: () => void
  onOpenPalette: () => void
}

export function Navbar({ theme, onToggleTheme, onNavigate, onOpenPalette }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('#home')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    navItems.forEach((item) => {
      const el = document.querySelector(item.href)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed inset-x-0 top-0 z-[90] transition-colors duration-300',
          scrolled ? 'glass border-b border-line/30' : 'bg-transparent',
        )}
      >
        <nav className="container-shell flex h-[72px] items-center justify-between" aria-label="Main navigation">
          <a href="#home" className="group flex items-center gap-3" aria-label={`${profile.name} — home`}>
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-gradient font-display text-sm font-bold text-white shadow-[0_0_24px_rgba(139,92,246,.4)]">
              {profile.initials}
            </span>
            <span className="hidden font-display text-sm font-semibold tracking-tight sm:block">
              {profile.name}
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  'group relative font-mono text-xs uppercase tracking-widest transition-colors',
                  active === item.href ? 'text-ink' : 'text-muted hover:text-ink',
                )}
              >
                <span className="mr-1 text-[9px] text-accent-violet">{item.index}</span>
                <TextScramble text={item.label} />
                <span
                  className={cn(
                    'absolute -bottom-1.5 left-0 h-px bg-accent-gradient transition-all duration-300',
                    active === item.href ? 'w-full' : 'w-0 group-hover:w-full',
                  )}
                />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPalette}
              className="hidden items-center gap-2 rounded-full border border-line/50 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted transition-colors hover:border-accent-cyan hover:text-accent-cyan md:flex"
              aria-label="Open command palette"
              data-cursor="Search"
            >
              <span className="text-accent-violet">⌘</span> Ctrl K
            </button>
            <button
              onClick={onToggleTheme}
              className="grid h-10 w-10 place-items-center rounded-full border border-line/50 text-muted transition-colors hover:border-accent-cyan hover:text-accent-cyan"
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              data-cursor="Theme"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button
              onClick={() => setOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full border border-line/50 text-muted transition-colors hover:border-accent-cyan hover:text-accent-cyan lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={19} />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[95] flex flex-col bg-bg/95 px-6 py-6 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-bold">{profile.name}</span>
              <button
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-line/50"
                aria-label="Close menu"
              >
                <X size={19} />
              </button>
            </div>
            <div className="mt-16 flex flex-col gap-3">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    setOpen(false)
                    onNavigate()
                  }}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="flex items-baseline gap-4 border-b border-line/30 py-4 font-display text-3xl font-semibold"
                >
                  <span className="font-mono text-xs text-accent-violet">{item.index}</span>
                  {item.label}
                </motion.a>
              ))}
            </div>
            <a
              href={`mailto:${profile.email}`}
              className="mt-auto font-mono text-xs text-muted"
            >
              {profile.email}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
