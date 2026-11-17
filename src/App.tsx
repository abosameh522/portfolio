import { useCallback, useEffect, useState } from 'react'
import { Cursor } from './components/Cursor'
import { Navbar } from './components/Navbar'
import { Preloader } from './components/Preloader'
import { ScrollProgress } from './components/ScrollProgress'
import { KonamiEasterEgg } from './components/KonamiEasterEgg'
import { CommandPalette } from './components/CommandPalette'
import { LiveDataTicker } from './components/LiveDataTicker'
import { PipelinePacketLine } from './components/PipelinePacketLine'
import { SectionWipe } from './components/SectionWipe'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Projects } from './sections/Projects'
import { Skills } from './sections/Skills'
import { Experience } from './sections/Experience'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'
import { useLenis } from './hooks/useLenis'
import { useReducedMotion } from './hooks/useReducedMotion'
import { ScrollTrigger } from './utils/gsap'
import { ModalPauseProvider } from './context/ModalPauseContext'
import { PopoverProvider } from './context/PopoverContext'
import type { Project } from './types'

type Theme = 'dark' | 'light'

function readInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored === 'dark' || stored === 'light') return stored
  } catch {
    /* ignore private-mode storage errors */
  }
  return 'dark' // dark by default
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(readInitialTheme)
  const [ready, setReady] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [wipeActive, setWipeActive] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const reduced = useReducedMotion()

  useLenis()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* ignore */
    }
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#07070b' : '#f4f5fa')
  }, [theme])

  // Ctrl / Cmd + K opens the command palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((open) => !open)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  const onLoaded = useCallback(() => {
    setReady(true)
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [])

  const navigate = useCallback(() => {
    if (!reduced) setWipeActive(true)
  }, [reduced])

  return (
    <ModalPauseProvider>
      <PopoverProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[130] focus:rounded-lg focus:bg-accent-violet focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <Cursor />
      <ScrollProgress />
      <div className="grain" aria-hidden="true" />
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onNavigate={navigate}
        onOpenPalette={() => setPaletteOpen(true)}
      />
      <LiveDataTicker />
      <PipelinePacketLine />
      <Preloader onComplete={onLoaded} />
      <KonamiEasterEgg />
      <SectionWipe active={wipeActive} onDone={() => setWipeActive(false)} />
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenProject={setSelectedProject}
      />

      <main id="main-content">
        <Hero ready={ready} />
        <About />
        <Projects selected={selectedProject} onSelect={setSelectedProject} />
        <Skills />
        <Experience onOpenProject={setSelectedProject} />
        <Contact />
      </main>
      <Footer />
      </PopoverProvider>
    </ModalPauseProvider>
  )
}
