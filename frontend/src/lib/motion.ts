import type { Variants, Transition } from 'framer-motion'

/**
 * Shared motion language for the whole site. Every page previously
 * redefined its own ad-hoc `fadeUp` object with slightly different
 * durations/offsets — this is the one source of truth so scroll reveals,
 * stagger timing, and hover/tap feel consistent everywhere.
 */

export const EASE = [0.22, 1, 0.36, 1] as const

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

export const fadeUpViewport = { once: true, margin: '-80px' }

/** Convenience spread for a one-off scroll reveal: `<motion.div {...reveal(index)}>` */
export const reveal = (index = 0, delay = 0.06) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: fadeUpViewport,
  transition: { duration: 0.6, ease: EASE, delay: index * delay },
})

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1, transition: { duration: 0.7, ease: EASE } },
}

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.94 },
  whileInView: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } },
}

/** Parent container for staggered children — pair with `staggerItem` on each child. */
export const staggerContainer: Variants = {
  initial: {},
  whileInView: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

/** Large display-text reveal for hero titles — slightly slower, more dramatic. */
export const heroTitle: Variants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
}

export const heroChild = (delay: number): Transition => ({ duration: 0.7, ease: EASE, delay })

/** Hover/tap micro-interaction for cards and tappable tiles. */
export const cardHover = {
  whileHover: { y: -6, transition: { duration: 0.3, ease: EASE } },
  whileTap: { scale: 0.98 },
}

/** Magnetic-feeling button press. */
export const buttonTap = { whileTap: { scale: 0.96 } }

export const pageTransition: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.35, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}
