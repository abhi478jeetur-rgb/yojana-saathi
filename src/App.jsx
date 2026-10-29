import { useEffect, useRef, useState } from 'react'
import { SCHEMES } from './data/schemes.js'
import { appwriteEnabled, fetchSchemes, vectorSearch } from './lib/appwrite/index.js'
import { blendResults, matchSchemes } from './lib/search/match.js'
import { useChecklist } from './lib/useChecklist.js'
import { gsap, reduceMotion, useGSAP } from './lib/motion.js'
import Nav from './components/Nav.jsx'
import Home from './components/Home.jsx'
import Browse from './components/Browse.jsx'
import Checklist from './components/Checklist.jsx'
import About from './components/About.jsx'

export default function App() {
  const [tab, setTab] = useState('home')
  const [schemes, setSchemes] = useState(SCHEMES)
  const [mode, setMode] = useState(appwriteEnabled ? 'appwrite' : 'demo')
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState(null) // { query, results, semantic }
  const [loading, setLoading] = useState(false)
  const checklist = useChecklist()
  const pageRef = useRef(null)

  useEffect(() => {
    if (!appwriteEnabled) return
    fetchSchemes()
      .then((rows) => rows.length && setSchemes(rows))
      .catch((err) => {
        console.warn('[appwrite] using bundled schemes', err)
        setMode('demo')
      })
  }, [])

  useGSAP(
    () => {
      if (reduceMotion()) return
      gsap.fromTo(pageRef.current, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' })
    },
    { dependencies: [tab], scope: pageRef }
  )

  async function runSearch(text) {
    const q = text.trim()
    if (!q) return
    setLoading(true)
    const { results } = matchSchemes(q, schemes)
    let final = results
    let semantic = false
    if (mode === 'appwrite') {
      try {
        const hits = await vectorSearch(q)
        final = blendResults(results, hits, schemes)
        semantic = true
      } catch (err) {
        console.warn('[appwrite] vector search unavailable, rule matching only', err)
      }
    }
    setSearch({ query: q, results: final, semantic })
    setLoading(false)
  }

  const go = (t) => {
    setTab(t)
    window.scrollTo({ top: 0, behavior: reduceMotion() ? 'auto' : 'smooth' })
  }

  return (
    <div className="app">
      <Nav tab={tab} onChange={go} savedCount={Object.keys(checklist.lists).length} />
      <main className="page" ref={pageRef} key={tab}>
        {tab === 'home' && (
          <Home
            query={query}
            setQuery={setQuery}
            onSearch={runSearch}
            search={search}
            loading={loading}
            checklist={checklist}
          />
        )}
        {tab === 'schemes' && <Browse schemes={schemes} checklist={checklist} />}
        {tab === 'checklist' && <Checklist schemes={schemes} checklist={checklist} onFind={() => go('home')} />}
        {tab === 'about' && <About mode={mode} count={schemes.length} />}
      </main>
    </div>
  )
}
