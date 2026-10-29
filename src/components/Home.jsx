import { useRef } from 'react'
import { Sparkles } from 'lucide-react'
import SearchBox from './SearchBox.jsx'
import SchemeCard from './SchemeCard.jsx'
import { gsap, reduceMotion, useGSAP } from '../lib/motion.js'

export default function Home({ query, setQuery, onSearch, search, loading, checklist }) {
  const listRef = useRef(null)
  const countRef = useRef(null)

  useGSAP(
    () => {
      if (!search) return
      const n = search.results.length
      if (reduceMotion()) {
        countRef.current && (countRef.current.textContent = n)
        return
      }
      const counter = { v: 0 }
      gsap.to(counter, {
        v: n,
        duration: 0.8,
        ease: 'power2.out',
        onUpdate: () => countRef.current && (countRef.current.textContent = Math.round(counter.v))
      })
      gsap.from('.scheme-card', { autoAlpha: 0, y: 28, duration: 0.5, stagger: 0.07, ease: 'power3.out' })
    },
    { dependencies: [search], scope: listRef }
  )

  return (
    <div className="home-grid">
      <section className="hero">
        <p className="eyebrow">
          <Sparkles size={16} /> Free. No sign-up.
        </p>
        <h1>
          Find government schemes <span className="grad">made for you</span>
        </h1>
        <p className="lede">Tell us about yourself in simple words. English or Hinglish both work.</p>
        <SearchBox value={query} onChange={setQuery} onSubmit={onSearch} loading={loading} />
      </section>

      <section className="results" ref={listRef} aria-live="polite">
        {!search && (
          <div className="empty glass">
            <h2>How it works</h2>
            <ol className="steps">
              <li>
                <b>1</b> Describe your life: work, family, where you live.
              </li>
              <li>
                <b>2</b> See schemes that fit you, with the reason why.
              </li>
              <li>
                <b>3</b> Tick off documents and apply on the official site.
              </li>
            </ol>
          </div>
        )}
        {search && (
          <>
            <div className="results-head">
              <h2>
                <span ref={countRef} className="count-up">
                  0
                </span>{' '}
                {search.results.length === 1 ? 'scheme' : 'schemes'} for you
              </h2>
              {search.semantic && <span className="pill">Smart search</span>}
            </div>
            {search.results.length === 0 && (
              <div className="empty glass">
                <p>We could not find a match. Try adding your work (farmer, shop, student), age, or family details.</p>
              </div>
            )}
            {search.results.map((r, i) => (
              <SchemeCard key={r.scheme.id} scheme={r.scheme} match={r} checklist={checklist} defaultOpen={i === 0} />
            ))}
          </>
        )}
      </section>
    </div>
  )
}
