import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../utils/gsap'
import { useReducedMotion } from './useReducedMotion'

/** Shared instance so overlays (e.g. the project modal) can pause scrolling. */
let lenisSingleton: Lenis | null = null
export function getLenis() {
  return lenisSingleton
}

/**
 * Initialises Lenis smooth scrolling and syncs it with GSAP ScrollTrigger.
 * Disabled entirely when the user prefers reduced motion.
 * Returns a ref to the Lenis instance (useful for programmatic scrollTo).
 */
export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    lenisRef.current = lenis
    lenisSingleton = lenis

    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)

    const update = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    // Route in-page anchor clicks through Lenis for buttery navigation.
    const handleAnchorClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement)?.closest<HTMLAnchorElement>('a[href^="#"]')
      if (!target) return
      const href = target.getAttribute('href')
      if (!href || href === '#') return
      const el = document.querySelector(href)
      if (!el) return
      event.preventDefault()
      lenis.scrollTo(el as HTMLElement, { offset: 0, duration: 1.4 })
      history.replaceState(null, '', href)
    }
    document.addEventListener('click', handleAnchorClick)

    return () => {
      document.removeEventListener('click', handleAnchorClick)
      gsap.ticker.remove(update)
      lenis.off('scroll', onScroll)
      lenis.destroy()
      lenisRef.current = null
      lenisSingleton = null
    }
  }, [reduced])

  return lenisRef
}
