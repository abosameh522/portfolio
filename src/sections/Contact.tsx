import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, Linkedin, Mail, Check, ArrowUpRight, Send } from 'lucide-react'
import { profile, socials } from '../data/profile'
import { SectionHeading } from '../components/SectionHeading'
import { MagneticButton } from '../components/MagneticButton'
import { SpotlightLayer } from '../components/SpotlightLayer'
import { useMagnetic } from '../hooks/useMagnetic'

const iconMap = { github: Github, linkedin: Linkedin, mail: Mail, twitter: Mail }

function SocialItem({ href, label, icon }: { href: string; label: string; icon: keyof typeof iconMap }) {
  const { ref, onPointerMove, onPointerLeave } = useMagnetic<HTMLAnchorElement>(0.4)
  const Icon = iconMap[icon]
  return (
    <a
      ref={ref}
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      data-cursor="Open"
      className="group flex items-center gap-3 rounded-full border border-line/50 px-5 py-3 font-mono text-xs text-muted transition-colors hover:border-line hover:bg-surface-2 hover:text-ink"
      aria-label={label}
    >
      <Icon size={16} className="transition-transform group-hover:rotate-12" />
      {label}
      <ArrowUpRight size={13} className="opacity-0 transition-opacity group-hover:opacity-100" />
    </a>
  )
}

interface Errors {
  name?: string
  email?: string
  message?: string
}

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  const update = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const validate = (): Errors => {
    const next: Errors = {}
    if (!form.name.trim()) next.name = 'Please enter your name'
    if (!form.email.trim()) next.email = 'Please enter your email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'That email looks off'
    if (!form.message.trim()) next.message = 'Please write a message'
    return next
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return

    // Front-end only: compose a mailto so the visitor can actually send it.
    const subject = encodeURIComponent(form.subject || `Portfolio message from ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    setSent(true)
  }

  const inputClass =
    'w-full rounded-xl border border-line/50 bg-surface/60 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-accent-cyan'

  return (
    <section id="contact" className="section-pad relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/4 top-0 h-96 w-96 rounded-full bg-accent-pink/10 blur-[130px]" />
      <div className="container-shell relative">
        <SectionHeading index="06" eyebrow="Contact / let's connect" title={<>Have an idea? <span className="gradient-text">Let&apos;s build it.</span></>} align="center" />
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mx-auto mt-6 max-w-xl text-center text-sm leading-relaxed text-muted"
        >
          I&apos;m looking for junior Data Engineer opportunities in Egypt or remote. Got a project, role or just want to say hi? Drop a message below.
        </motion.p>

        <div className="mx-auto mt-14 grid max-w-5xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* left: details + socials */}
          <div>
            <div className="mono-label mb-6">// direct line</div>
            <a
              href={`mailto:${profile.email}`}
              className="block break-all font-display text-xl font-semibold transition-colors hover:text-accent-cyan sm:text-2xl"
              data-cursor="Email"
            >
              {profile.email}
            </a>
            <p className="mt-4 flex items-center gap-2 font-mono text-xs text-muted">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              {profile.availability}
            </p>

            <div className="mono-label mb-4 mt-12">// find me on</div>
            <div className="flex flex-wrap gap-3">
              {socials.map((s) => (
                <SocialItem key={s.label} {...s} />
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-dashed border-line/60 p-5 font-mono text-xs text-muted">
              <span className="text-accent-violet">note:</span> this form is front-end only — submitting opens your email app with the message pre-filled. No data is stored.
            </div>
          </div>

          {/* right: form — spotlight reveals a circuit grid under the glass */}
          <div
            className="spotlight-host glass relative overflow-hidden rounded-3xl p-6 sm:p-9"
            style={{ '--mx': '50%', '--my': '50%' } as React.CSSProperties}
            onPointerMove={(e) => {
              const el = e.currentTarget
              const rect = el.getBoundingClientRect()
              el.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`)
              el.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`)
            }}
          >
            <SpotlightLayer hue={320} />
            <div className="relative z-10">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex min-h-[380px] flex-col items-center justify-center text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
                    className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-accent-cyan to-accent-violet text-white shadow-[0_0_50px_rgba(34,211,238,.5)]"
                  >
                    <Check size={36} />
                  </motion.div>
                  <h3 className="mt-6 font-display text-2xl font-bold">Message ready!</h3>
                  <p className="mt-2 max-w-sm text-sm text-muted">
                    Your email app should have opened with everything filled in. If it didn&apos;t, email me directly at {profile.email}.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false)
                      setForm({ name: '', email: '', subject: '', message: '' })
                    }}
                    className="mt-6 font-mono text-xs uppercase tracking-widest text-accent-cyan underline underline-offset-4"
                  >
                    Send another
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={onSubmit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Your name" error={errors.name}>
                      <input className={inputClass} value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Ahmed" aria-invalid={!!errors.name} />
                    </Field>
                    <Field label="Your email" error={errors.email}>
                      <input type="email" className={inputClass} value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" aria-invalid={!!errors.email} />
                    </Field>
                  </div>
                  <Field label="Subject (optional)">
                    <input className={inputClass} value={form.subject} onChange={(e) => update('subject', e.target.value)} placeholder="Data Engineer opportunity" />
                  </Field>
                  <Field label="Message" error={errors.message}>
                    <textarea rows={5} className={`${inputClass} resize-none`} value={form.message} onChange={(e) => update('message', e.target.value)} placeholder="Tell me about your project or role..." aria-invalid={!!errors.message} />
                  </Field>
                  <MagneticButton type="submit" cursorLabel="Send" className="w-full !py-4">
                    Send message <Send size={16} />
                  </MagneticButton>
                </motion.form>
              )}
            </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mono-label mb-2 block !normal-case !tracking-normal">{label}</span>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 block font-mono text-[11px] text-accent-pink"
            role="alert"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  )
}
