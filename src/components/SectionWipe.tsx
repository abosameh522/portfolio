import { AnimatePresence, motion } from 'framer-motion'

/** Fast gradient wipe + glitch bars played when navigating between sections. */
export function SectionWipe({ active, onDone }: { active: boolean; onDone: () => void }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="section-wipe"
          className="pointer-events-none fixed inset-0 z-[118] overflow-hidden"
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)', 'inset(0 0 0 100%)'] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.68, times: [0, 0.42, 1], ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={onDone}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-pink opacity-95" />
          {[18, 42, 66, 84].map((top, i) => (
            <motion.div
              key={top}
              className="absolute left-0 h-[2px] w-full bg-white/40"
              style={{ top: `${top}%` }}
              animate={{ x: [0, i % 2 ? 40 : -40, 0] }}
              transition={{ duration: 0.22, repeat: 3 }}
            />
          ))}
          <div className="absolute inset-0 grid place-items-center">
            <span className="font-mono text-xs uppercase tracking-[0.4em] text-white/80">pipe://navigating</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
