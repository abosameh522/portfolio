import { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { lerp } from '../utils/helpers'

/**
 * Glowing dot + trailing ring custom cursor. The ring grows over interactive
 * elements and shows a contextual label (View / Open / Drag / etc.).
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  const fine = useMediaQuery('(pointer: fine)')
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!fine || reduced) return
    document.body.classList.add('custom-cursor')

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const dot = { x: target.x, y: target.y }
    const ring = { x: target.x, y: target.y }
    let raf = 0
    let visible = false

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      if (!visible) {
        visible = true
        dot.x = ring.x = target.x
        dot.y = ring.y = target.y
        if (dotRef.current) dotRef.current.style.opacity = '1'
        if (ringRef.current) ringRef.current.style.opacity = '1'
      }
    }

    const onOver = (e: MouseEvent) => {
      const el =
        e.target instanceof HTMLElement
          ? e.target.closest<HTMLElement>('a, button, [role="button"], [data-cursor], input, textarea, select')
          : null
      if (!el) return
      const text = el.dataset.cursor || (el.tagName === 'A' ? 'Open' : 'Click')
      setLabel(text)
      if (ringRef.current) {
        ringRef.current.style.width = '64px'
        ringRef.current.style.height = '64px'
        ringRef.current.style.borderColor = 'rgb(34 211 238 / 0.9)'
      }
    }

    const onOut = (e: MouseEvent) => {
      const el =
        e.target instanceof HTMLElement
          ? e.target.closest<HTMLElement>('a, button, [role="button"], [data-cursor], input, textarea, select')
          : null
      if (!el) return
      const related = e.relatedTarget as HTMLElement | null
      if (related && el.contains(related)) return
      setLabel('')
      if (ringRef.current) {
        ringRef.current.style.width = '36px'
        ringRef.current.style.height = '36px'
        ringRef.current.style.borderColor = 'rgb(139 92 246 / 0.8)'
      }
    }

    const onLeave = () => {
      visible = false
      if (dotRef.current) dotRef.current.style.opacity = '0'
      if (ringRef.current) ringRef.current.style.opacity = '0'
    }

    // Overlays dispatch this when they close so no stale label lingers.
    const onReset = () => {
      setLabel('')
      if (ringRef.current) {
        ringRef.current.style.width = '36px'
        ringRef.current.style.height = '36px'
        ringRef.current.style.borderColor = 'rgb(139 92 246 / 0.8)'
      }
    }

    const render = () => {
      dot.x = lerp(dot.x, target.x, 0.35)
      dot.y = lerp(dot.y, target.y, 0.35)
      ring.x = lerp(ring.x, target.x, 0.14)
      ring.y = lerp(ring.y, target.y, 0.14)
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%, -50%)`
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`
      if (labelRef.current) labelRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(render)
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('portfolio:cursor-reset', onReset)
    raf = requestAnimationFrame(render)

    return () => {
      document.body.classList.remove('custom-cursor')
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('portfolio:cursor-reset', onReset)
      cancelAnimationFrame(raf)
    }
  }, [fine, reduced])

  if (!fine || reduced) return null

  return (
    <>
      <div ref={dotRef} className="cursor-dot" style={{ opacity: 0 }} aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" style={{ opacity: 0 }} aria-hidden="true" />
      <div ref={labelRef} className="cursor-label" aria-hidden="true">
        {label}
      </div>
    </>
  )
}
