import { ArrowUp } from 'lucide-react'
import { profile, socials } from '../data/profile'
import { Marquee } from '../components/Marquee'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function Footer() {
  const reduced = useReducedMotion()

  return (
    <footer className="relative overflow-hidden border-t border-line/30 pt-16">
      {/* giant marquee */}
      <Marquee slow className="border-y border-line/30 py-4">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} className="mx-6 font-display text-4xl font-bold uppercase tracking-tight text-transparent sm:text-6xl" style={{ WebkitTextStroke: '1px rgb(var(--line) / 0.8)' }}>
            Let&apos;s build something {i % 2 === 0 ? 'great' : 'meaningful'} <span className="mx-6 text-accent-violet">✳</span>
          </span>
        ))}
      </Marquee>

      <div className="container-shell py-12">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          <div>
            <a href="#home" className="font-display text-2xl font-bold tracking-tight" aria-label="Back to top — Ahmed Sameh">
              {profile.name}
            </a>
            <p className="mt-2 font-mono text-xs text-muted">{profile.pageTitle} — {profile.location}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 font-mono text-xs text-muted">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent-cyan"
                data-cursor="Open"
                aria-label={`${s.label} — open ${s.label === 'Email' ? 'email client' : 'profile in a new tab'}`}
              >
                {s.label}
              </a>
            ))}
          </div>

          <button
            onClick={() => {
              if (reduced) window.scrollTo({ top: 0 })
              else window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="group flex items-center gap-2 rounded-full border border-line/50 px-5 py-3 font-mono text-xs text-muted transition-colors hover:border-accent-cyan hover:text-accent-cyan"
            data-cursor="Top"
            aria-label="Back to top"
          >
            Back to top
            <ArrowUp size={14} className="transition-transform group-hover:-translate-y-1" />
          </button>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-line/30 pt-6 font-mono text-[11px] text-muted sm:flex-row">
          <span>© {new Date().getFullYear()} {profile.name}. All rights reserved.</span>
          <span>Built with <span className="text-accent-pink">♥</span> in Egypt · Data flowing through pipelines.</span>
        </div>
      </div>
    </footer>
  )
}
