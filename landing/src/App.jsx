import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'
import {
  ArrowRight,
  Bookmark,
  BookOpenCheck,
  Database,
  ExternalLink,
  FileX2,
  HandCoins,
  Heart,
  Landmark,
  Languages,
  ListChecks,
  MessageSquareText,
  ScrollText,
  Search,
  Sparkles,
  Table2,
  Waypoints,
} from 'lucide-react'
import GoluStage from './components/GoluStage'
import SearchMock from './components/SearchMock'
import { APP_URL, GITHUB_URL, SCHEMES } from './data'
import goluWave from './assets/golu/golu-wave.webp'
import goluHero from './assets/golu/golu-hero.webp'
import goluCheck from './assets/golu/golu-check.webp'
import goluCelebrate from './assets/golu/golu-celebrate.webp'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const GithubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
  </svg>
)

const PROBLEMS = [
  { icon: Landmark, title: 'Scattered across ministries', text: 'Hundreds of schemes live on dozens of different portals. Finding the ones meant for you feels like a treasure hunt.' },
  { icon: ScrollText, title: 'Jargon-heavy eligibility', text: 'Rules written in dense government language leave people unsure whether they even qualify.' },
  { icon: HandCoins, title: 'Middlemen charging fees', text: 'Agents charge money just to tell families about benefits that are already theirs for free.' },
  { icon: FileX2, title: 'Wasted office trips', text: 'One missing document means another day off work and another trip back to the office.' },
]

const STEPS = [
  { img: goluWave, title: 'Tell Golu your situation', text: 'Type it the way you would say it, in plain English or Hinglish. "Main kisan hoon, Bihar se" works just fine.' },
  { img: goluHero, title: 'See the schemes you match', text: 'Semantic search lights up the central schemes that fit you, with benefits and eligibility in simple words.' },
  { img: goluCheck, title: 'Tick off your documents', text: 'Every scheme comes with a documents checklist you can tick and save, so your first office visit is your last.' },
]

const FEATURES = [
  { icon: Languages, title: 'English & Hinglish', text: 'No forms or dropdowns. Describe your life in your own words.' },
  { icon: Waypoints, title: 'Meaning, not keywords', text: 'Vector search understands that “kheti” and “farmer” mean the same thing.' },
  { icon: BookOpenCheck, title: 'Eligibility, decoded', text: 'Who qualifies, explained in short, clear sentences.' },
  { icon: ListChecks, title: 'Tickable checklist', text: 'Know exactly which documents to carry, and track what you already have.' },
  { icon: Bookmark, title: 'Saved for later', text: 'Your checklist is saved, so you can pick up right where you left off.' },
  { icon: ExternalLink, title: 'Straight to the source', text: 'Apply on the official portal yourself. No agents, no fees.' },
]

function Navbar() {
  return (
    <header className="nav-wrap">
      <nav className="nav glass">
        <a href="#top" className="brand">
          <img src={goluWave} alt="" width="34" height="34" />
          <span>Yojana Saathi</span>
        </a>
        <div className="nav-links">
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <a href="#appwrite">Appwrite</a>
          <a href="#schemes">Schemes</a>
        </div>
        <a className="btn btn-primary btn-sm" href={APP_URL}>
          Try the app <ArrowRight size={15} />
        </a>
      </nav>
    </header>
  )
}

function SectionHead({ eyebrow, title, text }) {
  return (
    <div className="section-head">
      <span className="eyebrow reveal">{eyebrow}</span>
      <h2 className="reveal">{title}</h2>
      {text && <p className="reveal">{text}</p>}
    </div>
  )
}

export default function App() {
  const root = useRef(null)

  // Lenis smooth scroll, synced with ScrollTrigger (skipped for reduced motion)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a || a.getAttribute('href').length < 2) return
      const el = document.querySelector(a.getAttribute('href'))
      if (el) {
        e.preventDefault()
        lenis.scrollTo(el, { offset: -80 })
      }
    }
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('click', onClick)
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // hero entrance
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.from('.nav', { y: -30, opacity: 0, duration: 0.8 })
          .from('.hero-badge', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
          .from('.hero-title .line', { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.12 }, '-=0.3')
          .from('.hero-sub', { y: 20, opacity: 0, duration: 0.7 }, '-=0.5')
          .from('.hero-ctas > *', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.45')
          .from('.golu-stage', { scale: 0.85, opacity: 0, duration: 1.1 }, 0.3)
          .from('.search-mock', { y: 40, opacity: 0, duration: 0.9 }, '-=0.6')

        // generic reveals
        gsap.set('.reveal', { opacity: 0 })
        ScrollTrigger.batch('.reveal', {
          start: 'top 88%',
          once: true,
          onEnter: (els) => gsap.fromTo(els, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out' }),
        })

        // problem cards: scattered -> aligned
        gsap.utils.toArray('.problem-card').forEach((card, i) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 60, rotation: i % 2 ? 5 : -5, x: i % 2 ? 30 : -30 },
            { opacity: 1, y: 0, x: 0, rotation: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 90%', once: true } },
          )
        })

        // steps: progress line + pop-in
        gsap.fromTo('.steps-line i', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 75%', end: 'bottom 60%', scrub: true } })
        gsap.utils.toArray('.step').forEach((step) => {
          const tl2 = gsap.timeline({ scrollTrigger: { trigger: step, start: 'top 85%', once: true } })
          tl2.fromTo(step, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
            .fromTo(step.querySelector('.step-golu'), { scale: 0.6, rotation: -8 }, { scale: 1, rotation: 0, duration: 0.9, ease: 'back.out(1.8)' }, '-=0.6')
          gsap.to(step.querySelector('.step-golu'), { y: -8, duration: 2.2 + Math.random(), yoyo: true, repeat: -1, ease: 'sine.inOut' })
        })

        // features
        gsap.fromTo('.feature', { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '.features-grid', start: 'top 85%', once: true } })

        // appwrite diagram
        const dtl = gsap.timeline({ scrollTrigger: { trigger: '.diagram', start: 'top 80%', once: true } })
        dtl.fromTo('.d-node', { opacity: 0, y: 30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.35, ease: 'back.out(1.6)' })
          .fromTo('.d-link', { '--fill': 0 }, { '--fill': 1, duration: 0.5, stagger: 0.35, ease: 'power2.out' }, 0.3)

        // final CTA golu
        gsap.fromTo('.cta-golu', { y: 80, opacity: 0, scale: 0.8 }, { y: 0, opacity: 1, scale: 1, duration: 1.1, ease: 'back.out(1.5)', scrollTrigger: { trigger: '.cta', start: 'top 80%', once: true } })
        gsap.to('.cta-golu-wrap', { y: -14, rotation: 2, duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' })

        // background parallax blobs
        gsap.to('.blob-a', { yPercent: 40, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true } })
        gsap.to('.blob-b', { yPercent: -30, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true } })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <div className="page" ref={root} id="top">
      <div className="bg-blobs" aria-hidden="true">
        <span className="blob blob-a" />
        <span className="blob blob-b" />
        <span className="grain" />
      </div>

      <Navbar />

      {/* HERO */}
      <section className="hero container">
        <div className="hero-copy">
          <span className="hero-badge glass">
            <Sparkles size={14} /> Built on Appwrite TablesDB + VectorsDB
          </span>
          <h1 className="hero-title">
            <span className="line-mask"><span className="line">Every scheme</span></span>{' '}
            <span className="line-mask"><span className="line">you deserve,</span></span>{' '}
            <span className="line-mask"><span className="line grad-text">in one simple</span></span>{' '}
            <span className="line-mask"><span className="line grad-text">search.</span></span>
          </h1>
          <p className="hero-sub">
            Describe your situation in plain English or Hinglish. Yojana Saathi finds the central government schemes you qualify for, explains the benefits and eligibility, and hands you a documents checklist you can tick off.
          </p>
          <div className="hero-ctas">
            <a className="btn btn-primary" href={APP_URL}>
              Try the app <ArrowRight size={18} />
            </a>
            <a className="btn btn-ghost" href={GITHUB_URL}>
              <GithubIcon /> View on GitHub
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <GoluStage />
        </div>
        <div className="hero-search">
          <SearchMock />
        </div>
      </section>

      {/* PROBLEM */}
      <section className="section container" id="problem">
        <SectionHead eyebrow="The problem" title={<>Help exists. <span className="grad-text">Finding it shouldn't be this hard.</span></>} text="India runs hundreds of welfare schemes, yet many families never claim what they are entitled to." />
        <div className="problem-grid">
          {PROBLEMS.map(({ icon: Icon, title, text }) => (
            <article className="problem-card glass" key={title}>
              <span className="icon-tile"><Icon size={22} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section container" id="how">
        <SectionHead eyebrow="How it works" title={<>Three steps with <span className="grad-text">Golu by your side</span></>} text="Golu is a baby elephant, and elephants never forget. Neither will your checklist." />
        <div className="steps">
          <div className="steps-line" aria-hidden="true"><i /></div>
          {STEPS.map((s, i) => (
            <article className="step glass" key={s.title}>
              <div className="step-art">
                <span className="step-num">0{i + 1}</span>
                <img className="step-golu" src={s.img} alt="" loading="lazy" width="480" height="507" />
              </div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="section container" id="features">
        <SectionHead eyebrow="Features" title={<>Everything you need, <span className="grad-text">nothing you don't</span></>} />
        <div className="features-grid">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <article className="feature glass" key={title}>
              <span className="icon-tile"><Icon size={20} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* APPWRITE */}
      <section className="section container" id="appwrite">
        <SectionHead eyebrow="Powered by Appwrite Databases" title={<>Semantic search meets <span className="grad-text">structured data</span></>} text="VectorsDB understands what you mean. TablesDB holds every scheme's details and remembers your checklist." />
        <div className="diagram glass">
          <div className="d-node">
            <span className="d-icon"><MessageSquareText size={22} /></span>
            <strong>Your words</strong>
            <small>“meri beti ke liye savings scheme”</small>
          </div>
          <div className="d-link" aria-hidden="true"><span className="d-dot" /></div>
          <div className="d-node d-node-hot">
            <span className="d-icon"><Search size={22} /></span>
            <strong>VectorsDB</strong>
            <small>Embeds the query and finds the closest schemes by meaning</small>
          </div>
          <div className="d-link" aria-hidden="true"><span className="d-dot" /></div>
          <div className="d-node">
            <span className="d-icon"><Table2 size={22} /></span>
            <strong>TablesDB</strong>
            <small>Scheme details, eligibility, documents and your saved checklist</small>
          </div>
        </div>
        <div className="db-pills reveal">
          <span className="pill glass"><Database size={14} /> Appwrite TablesDB</span>
          <span className="pill glass"><Waypoints size={14} /> Appwrite VectorsDB</span>
        </div>
      </section>

      {/* SCHEMES MARQUEE */}
      <section className="section marquee-section" id="schemes">
        <div className="container">
          <SectionHead eyebrow="Schemes inside" title={<>From farms to first homes, <span className="grad-text">covered</span></>} />
        </div>
        <div className="marquee">
          <div className="marquee-track">
            {[...SCHEMES, ...SCHEMES].map((s, i) => (
              <span className="scheme-chip glass" key={i} aria-hidden={i >= SCHEMES.length}>
                <span className="dot" /> {s}
              </span>
            ))}
          </div>
        </div>
        <div className="marquee reverse">
          <div className="marquee-track">
            {[...SCHEMES.slice().reverse(), ...SCHEMES.slice().reverse()].map((s, i) => (
              <span className="scheme-chip glass" key={i} aria-hidden="true">
                <span className="dot" /> {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section container">
        <div className="cta glass">
          <div className="cta-golu-wrap"><img className="cta-golu" src={goluCelebrate} alt="Golu the baby elephant celebrating" loading="lazy" width="480" height="492" /></div>
          <div className="cta-copy">
            <h2 className="reveal">Find what's yours <span className="grad-text">in under a minute.</span></h2>
            <p className="reveal">No agents, no fees, no jargon. Just tell Golu about your life.</p>
            <div className="hero-ctas reveal">
              <a className="btn btn-primary" href={APP_URL}>
                Try the app <ArrowRight size={18} />
              </a>
              <a className="btn btn-ghost" href={GITHUB_URL}>
                <GithubIcon /> View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer container">
        <div className="brand">
          <img src={goluWave} alt="" width="30" height="30" loading="lazy" />
          <span>Yojana Saathi</span>
        </div>
        <p>
          Built for the Appwrite Databases Hackathon 2026 <Heart size={13} className="heart" /> MIT License
        </p>
        <p className="footer-note">Not affiliated with the Government of India. Always confirm details on the official scheme portal.</p>
      </footer>
    </div>
  )
}
