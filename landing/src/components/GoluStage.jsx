import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { CircleCheck, FileText, HeartPulse, House, Sprout } from 'lucide-react'
import goluHero from '../assets/golu/golu-hero.webp'

const ORBIT = [
  { icon: Sprout, title: 'PM-KISAN', sub: 'You qualify' },
  { icon: HeartPulse, title: 'Ayushman Bharat', sub: '₹5 lakh health cover' },
  { icon: FileText, title: 'Documents', sub: '3 of 4 ready' },
  { icon: House, title: 'PM Awas Yojana', sub: 'Housing support' },
]

const SPARKS = [
  [8, 18, 1], [86, 12, 0.7], [92, 58, 0.9], [4, 66, 0.6], [70, 88, 0.8], [24, 92, 0.55], [50, 4, 0.65], [62, 30, 0.45],
]

export default function GoluStage() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // gentle float + breathing
        gsap.to('.golu-float', { y: -16, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        gsap.to('.golu-img', { scale: 1.03, duration: 1.9, ease: 'sine.inOut', yoyo: true, repeat: -1, transformOrigin: '50% 100%' })
        gsap.to('.golu-img', { rotation: 1.6, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1, transformOrigin: '50% 100%' })
        // glow pulse
        gsap.to('.golu-glow', { scale: 1.12, opacity: 0.95, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        gsap.to('.golu-ring', { rotation: 360, duration: 40, ease: 'none', repeat: -1 })
        gsap.to('.golu-shadow', { scaleX: 0.82, opacity: 0.35, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 })

        // cards on an elliptical orbit, passing behind Golu
        const stage = root.current
        const cards = gsap.utils.toArray('.orbit-card', stage)
        cards.forEach((card, i) => {
          const state = { a: (i / cards.length) * Math.PI * 2 + 0.4 }
          gsap.to(state, {
            a: state.a + Math.PI * 2,
            duration: 22,
            ease: 'none',
            repeat: -1,
            onUpdate: () => {
              const w = stage.offsetWidth
              const rx = w * (w < 480 ? 0.29 : 0.4)
              const ry = w * 0.13
              const s = Math.sin(state.a)
              const depth = (s + 1) / 2 // 0 = back, 1 = front
              gsap.set(card, {
                x: Math.cos(state.a) * rx,
                y: s * ry + w * 0.08,
                scale: 0.78 + depth * 0.26,
                opacity: 0.55 + depth * 0.45,
                zIndex: depth > 0.5 ? 6 : 1,
                filter: `blur(${(1 - depth) * 1.4}px)`,
              })
            },
          })
        })

        gsap.utils.toArray('.spark', stage).forEach((el, i) => {
          gsap.fromTo(
            el,
            { scale: 0.2, opacity: 0, rotation: 0 },
            { scale: 1, opacity: 1, rotation: 90, duration: 1.4 + (i % 3) * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.35 },
          )
        })
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        const stage = root.current
        gsap.utils.toArray('.orbit-card', stage).forEach((card, i, arr) => {
          const a = (i / arr.length) * Math.PI * 2 + 0.4
          const w = stage.offsetWidth
          gsap.set(card, { x: Math.cos(a) * w * (w < 480 ? 0.29 : 0.4), y: Math.sin(a) * w * 0.13 + w * 0.08, zIndex: Math.sin(a) > 0 ? 6 : 1 })
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <div className="golu-stage" ref={root} aria-hidden="true">
      <div className="golu-glow" />
      <div className="golu-ring" />
      {SPARKS.map(([x, y, s], i) => (
        <svg key={i} className="spark" style={{ left: `${x}%`, top: `${y}%`, width: 22 * s, height: 22 * s }} viewBox="0 0 24 24">
          <path d="M12 0c.9 6.4 5.6 11.1 12 12-6.4.9-11.1 5.6-12 12-.9-6.4-5.6-11.1-12-12C6.4 11.1 11.1 6.4 12 0z" fill="#FFE3B3" />
        </svg>
      ))}
      <div className="orbit-layer">
        {ORBIT.map(({ icon: Icon, title, sub }) => (
          <div className="orbit-card glass" key={title}>
            <span className="orbit-icon"><Icon size={16} /></span>
            <span className="orbit-text">
              <strong>{title}</strong>
              <small>
                <CircleCheck size={11} /> {sub}
              </small>
            </span>
          </div>
        ))}
      </div>
      <div className="golu-float">
        <img className="golu-img" src={goluHero} alt="" width="720" height="761" fetchPriority="high" />
      </div>
      <div className="golu-shadow" />
    </div>
  )
}
