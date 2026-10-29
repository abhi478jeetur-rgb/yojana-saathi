import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ArrowRight, CircleCheck, FileText, Search, Sparkles } from 'lucide-react'
import { DEMO_QUERIES } from '../data'

const reduce = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function SearchMock() {
  const [idx, setIdx] = useState(0)
  const [typed, setTyped] = useState(reduce() ? DEMO_QUERIES[0].q : '')
  const [showResults, setShowResults] = useState(reduce())
  const resultsRef = useRef(null)

  // typing loop
  useEffect(() => {
    if (reduce()) return
    const full = DEMO_QUERIES[idx].q
    let i = 0
    let t
    setTyped('')
    setShowResults(false)
    const type = () => {
      i += 1
      setTyped(full.slice(0, i))
      if (i < full.length) t = setTimeout(type, 34 + Math.random() * 40)
      else t = setTimeout(() => setShowResults(true), 450)
    }
    t = setTimeout(type, 700)
    return () => clearTimeout(t)
  }, [idx])

  // reveal results, hold, then move to next query
  useEffect(() => {
    if (!showResults || !resultsRef.current) return
    const cards = resultsRef.current.querySelectorAll('.result-card')
    if (reduce()) {
      gsap.set(cards, { opacity: 1, y: 0 })
      return
    }
    const tl = gsap.timeline()
    tl.fromTo(cards, { opacity: 0, y: 18, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.14, ease: 'power3.out' })
    tl.fromTo(resultsRef.current.querySelectorAll('.match-bar i'), { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power2.out', stagger: 0.14 }, '<0.15')
    tl.to(cards, { opacity: 0, y: -10, duration: 0.35, stagger: 0.06, ease: 'power2.in' }, '+=3.4')
    tl.call(() => setIdx((v) => (v + 1) % DEMO_QUERIES.length))
    return () => tl.kill()
  }, [showResults])

  const current = DEMO_QUERIES[idx]

  return (
    <div className="search-mock glass">
      <div className="search-input">
        <Search size={18} className="search-icon" />
        <span className="search-text">
          {typed}
          <span className="caret" />
        </span>
        <span className="search-btn" aria-hidden="true">
          <ArrowRight size={16} />
        </span>
      </div>
      <div className="search-meta">
        <Sparkles size={13} />
        {showResults ? <span>Golu found {current.results.length} schemes that match you</span> : <span>Understanding your situation…</span>}
      </div>
      <div className="results" ref={resultsRef}>
        {!showResults && [0, 1].map((k) => (
          <div className="result-card skeleton" key={`s${k}`}>
            <i /><i /><i />
          </div>
        ))}
        {showResults &&
          current.results.map((r) => (
            <div className="result-card" key={r.name}>
              <div className="result-top">
                <strong>{r.name}</strong>
                <span className="chip">{r.tag}</span>
              </div>
              <p className="result-benefit">{r.benefit}</p>
              <div className="result-docs">
                <FileText size={13} />
                <span>{r.docs}</span>
              </div>
              <div className="match-bar">
                <i />
              </div>
              <div className="result-foot">
                <CircleCheck size={13} /> Likely eligible
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
