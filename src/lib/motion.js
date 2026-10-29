import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

export const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Small press feedback for buttons. */
export function press(e) {
  if (reduceMotion()) return
  gsap.fromTo(e.currentTarget, { scale: 0.94 }, { scale: 1, duration: 0.45, ease: 'back.out(3)' })
}

export { gsap, useGSAP }
