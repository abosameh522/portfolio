import { motion, useScroll, useSpring } from 'framer-motion'

/** Thin gradient bar that tracks page scroll progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return <motion.div className="scroll-progress left-0 right-0" style={{ scaleX }} aria-hidden="true" />
}
