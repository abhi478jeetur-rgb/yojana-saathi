import { useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'
import SearchBox from './SearchBox.jsx'
import SchemeCard from './SchemeCard.jsx'
import Thinking from './Thinking.jsx'
import TypedText from './TypedText.jsx'
import golu from '../assets/golu/golu-wave.webp'
import { gsap, reduceMotion, useGSAP } from '../lib/motion.js'

function Answer({ search, checklist }) {
  const [revealed, setRevealed] = useState(false)
  const listRef = useRef(null)
  const countRef = useRef(null)

  useGSAP(
    () => {
      if (!revealed) return
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
      gsap.from('.results-head', { autoAlpha: 0, y: 12, duration: 0.4, ease: 'power2.out' })
      gsap.from('.scheme-card', { autoAlpha: 0, y: 28, duration: 0.55, stagger: 0.14, delay: 0.15, ease: 'power3.out' })
    },
    { dependencies: [revealed], scope: listRef }
  )

  return (
    <div ref={listRef}>
      <div className="chat-row">
        <span className="avatar">
          <img src={golu} alt="" width="44" height="44" />
        </span>
        <p className="chat-bubble bot">
          <TypedText text={search.summary} onDone={() => setRevealed(true)} />
        </p>
      </div>
      {revealed && (
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
          {search.results.map((r, i) => (
            <SchemeCard key={r.scheme.id} scheme={r.scheme} match={r} checklist={checklist} defaultOpen={i === 0} />
          ))}
        </>
      )}
    </div>
  )
}

export default function Home({ query, setQuery, onSearch, search, loading, checklist }) {
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

      <section className="results" aria-live="polite">
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
            <div className="chat-row user">
              <p className="chat-bubble user">{search.query}</p>
            </div>
            {search.pending ? <Thinking /> : <Answer key={search.at} search={search} checklist={checklist} />}
          </>
        )}
      </section>
    </div>
  )
}
