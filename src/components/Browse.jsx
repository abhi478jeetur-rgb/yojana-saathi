import { useMemo, useRef, useState } from 'react'
import { Sprout, HeartPulse, Home as HomeIcon, Users, Briefcase, Landmark, Shield, GraduationCap, Hammer, Wheat, Sun, Accessibility, Wallet, LayoutGrid } from 'lucide-react'
import SchemeCard from './SchemeCard.jsx'
import { gsap, reduceMotion, useGSAP } from '../lib/motion.js'

const ICONS = {
  Farmers: Sprout,
  Health: HeartPulse,
  Housing: HomeIcon,
  Women: Users,
  Business: Briefcase,
  Pension: Landmark,
  Insurance: Shield,
  Banking: Wallet,
  Education: GraduationCap,
  'Jobs & Skills': Hammer,
  Workers: Hammer,
  Food: Wheat,
  Energy: Sun,
  Disability: Accessibility
}

export default function Browse({ schemes, checklist }) {
  const [cat, setCat] = useState('All')
  const ref = useRef(null)
  const cats = useMemo(() => ['All', ...new Set(schemes.map((s) => s.category))], [schemes])
  const list = cat === 'All' ? schemes : schemes.filter((s) => s.category === cat)

  useGSAP(
    () => {
      if (!reduceMotion()) gsap.from('.scheme-card', { autoAlpha: 0, y: 24, duration: 0.45, stagger: 0.04, ease: 'power3.out' })
    },
    { dependencies: [cat], scope: ref }
  )

  return (
    <div ref={ref}>
      <h1 className="page-title">Browse schemes</h1>
      <p className="lede">{schemes.length} central government schemes, grouped by who they help.</p>
      <div className="cat-row" role="tablist">
        {cats.map((c) => {
          const Icon = ICONS[c] || LayoutGrid
          return (
            <button key={c} role="tab" aria-selected={c === cat} className={`cat-chip ${c === cat ? 'on' : ''}`} onClick={() => setCat(c)}>
              <Icon size={18} /> {c}
            </button>
          )
        })}
      </div>
      <div className="card-grid">
        {list.map((s) => (
          <SchemeCard key={s.id} scheme={s} checklist={checklist} />
        ))}
      </div>
    </div>
  )
}
