import { useLayoutEffect, useRef } from 'react'
import { House, LayoutGrid, ListChecks, Info } from 'lucide-react'
import { gsap, reduceMotion } from '../lib/motion.js'
import { Link } from '../lib/router.js'

export const TABS = [
  { id: 'home', label: 'Home', Icon: House },
  { id: 'schemes', label: 'Schemes', Icon: LayoutGrid },
  { id: 'checklist', label: 'Checklist', Icon: ListChecks },
  { id: 'about', label: 'About', Icon: Info }
]

function Brand() {
  return (
    <Link to="/" className="brand" aria-label="Yojana Saathi home">
      <img src="/logo.svg" alt="" width="36" height="36" />
      <span>
        Yojana <b>Saathi</b>
      </span>
    </Link>
  )
}

export default function Nav({ tab, onChange, savedCount }) {
  const barRef = useRef(null)
  const pillRef = useRef(null)
  const deskRef = useRef(null)
  const index = TABS.findIndex((t) => t.id === tab)

  // Mobile: slide the raised bubble + notch; desktop: slide the pill highlight.
  useLayoutEffect(() => {
    const dur = reduceMotion() ? 0 : 0.55
    const bar = barRef.current
    if (bar && bar.offsetWidth) {
      const w = bar.offsetWidth / TABS.length
      gsap.to(bar, { '--x': `${w * (index + 0.5)}px`, duration: dur, ease: 'back.out(1.4)' })
    }
    const btn = deskRef.current?.children[index]
    if (btn && pillRef.current) {
      gsap.to(pillRef.current, { x: btn.offsetLeft, width: btn.offsetWidth, duration: dur * 0.8, ease: 'power3.out' })
    }
  }, [index])

  useLayoutEffect(() => {
    const onResize = () => {
      const bar = barRef.current
      if (bar) gsap.set(bar, { '--x': `${(bar.offsetWidth / TABS.length) * (index + 0.5)}px` })
      const btn = deskRef.current?.children[index]
      if (btn) gsap.set(pillRef.current, { x: btn.offsetLeft, width: btn.offsetWidth })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [index])

  const ActiveIcon = TABS[index].Icon

  return (
    <>
      <header className="topbar">
        <Brand />
        <nav className="desk-nav" aria-label="Main">
          <span className="desk-pill" ref={pillRef} />
          <div className="desk-tabs" ref={deskRef}>
            {TABS.map(({ id, label, Icon }) => (
              <button key={id} className={id === tab ? 'active' : ''} onClick={() => onChange(id)} aria-current={id === tab ? 'page' : undefined}>
                <Icon size={18} strokeWidth={2.2} />
                {label}
                {id === 'checklist' && savedCount > 0 && <em className="count">{savedCount}</em>}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <nav className="bottom-nav" aria-label="Main">
        <div className="bar" ref={barRef}>
          <span className="bubble" aria-hidden="true">
            <ActiveIcon size={28} strokeWidth={2.2} />
          </span>
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} className={id === tab ? 'active' : ''} onClick={() => onChange(id)} aria-label={label} aria-current={id === tab ? 'page' : undefined}>
              <span className="ico">
                <Icon size={24} strokeWidth={1.9} />
                {id === 'checklist' && savedCount > 0 && <em className="count">{savedCount}</em>}
              </span>
              <span className="lbl">{label}</span>
            </button>
          ))}
          <span className="handle" aria-hidden="true" />
        </div>
      </nav>
    </>
  )
}
