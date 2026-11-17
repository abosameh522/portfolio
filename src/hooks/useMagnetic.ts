import { useCallback, useEffect, useRef } from 'react'
import { gsap } from '../utils/gsap'
import { useReducedMotion } from './useReducedMotion'
import { isLowPowerDevice } from '../utils/helpers'

/**
 * Magnetic hover effect: the element drifts toward the cursor and snaps back.
 * Returns a ref to attach and the pointer handlers to spread onto the element.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T | null>(null)
  const reduced = useReducedMotion()

  const onPointerMove = useCallback(
    (event: React.PointerEvent<T>) => {
      if (reduced || isLowPowerDevice() || !ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const x = (event.clientX - rect.left - rect.width / 2) * strength
      const y = (event.clientY - rect.top - rect.height / 2) * strength
      gsap.to(ref.current, { x, y, duration: 0.4, ease: 'power3.out', overwrite: true })
    },
    [reduced, strength],
  )

  const onPointerLeave = useCallback(() => {
    if (!ref.current) return
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)', overwrite: true })
  }, [])

  useEffect(() => {
    return () => {
      if (ref.current) gsap.killTweensOf(ref.current)
    }
  }, [])

  return { ref, onPointerMove, onPointerLeave }
}
