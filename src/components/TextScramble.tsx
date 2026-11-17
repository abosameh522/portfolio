import { useEffect, useRef, useState } from 'react'
import { cn } from '../utils/helpers'

interface TextScrambleProps {
  text: string
  className?: string
  /** Trigger scrambling on mount instead of on hover (used sparingly). */
  auto?: boolean
}

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_\\/[]{}—=+*^?#________'

/**
 * Classic "text scramble" effect — characters resolve from random glyphs to
 * the final string. Triggered on hover/focus by default.
 */
export function TextScramble({ text, className, auto = false }: TextScrambleProps) {
  const [display, setDisplay] = useState(text)
  const frame = useRef<number | null>(null)
  const running = useRef(false)

  const scramble = () => {
    if (running.current) return
    running.current = true
    const start = performance.now()
    const duration = 620

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const revealed = Math.floor(progress * text.length)
      let out = ''
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          out += ' '
        } else if (i < revealed) {
          out += text[i]
        } else {
          out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        }
      }
      setDisplay(out)
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick)
      } else {
        setDisplay(text)
        running.current = false
      }
    }
    frame.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    if (auto) scramble()
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto])

  return (
    <span
      className={cn('inline-block', className)}
      onMouseEnter={scramble}
      onFocus={scramble}
      aria-label={text}
    >
      <span aria-hidden="true">{display}</span>
    </span>
  )
}
