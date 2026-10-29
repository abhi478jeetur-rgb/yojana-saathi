import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import {
  ArrowRight,
  ArrowUpRight,
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
  Table2,
  Waypoints
} from 'lucide-react'
import { Link } from '../lib/router.js'
import { SCHEMES } from '../data/schemes.js'
import { shortName } from '../lib/search/summary.js'
import Demos from './Demos.jsx'
import sunset from '../assets/golu/golu-sunset.webp'
import goluWave from '../assets/golu/golu-wave.webp'
import goluHero from '../assets/golu/golu-hero.webp'
import goluCheck from '../assets/golu/golu-check.webp'
import goluCelebrate from '../assets/golu/golu-celebrate.webp'
import './landing.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export const GITHUB_URL = 'https://github.com/abhi478jeetur-rgb/yojana-saathi'
export const YOUTUBE_URL = 'https://youtu.be/aGmhpYSczRE'

const YoutubeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
  </svg>
)

const GithubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
  </svg>
)

const PROBLEMS = [
  { icon: Landmark, title: 'Scattered information', text: 'Hundreds of schemes are spread across dozens of ministry portals. Finding the few meant for you is a treasure hunt.' },
  { icon: ScrollText, title: 'Jargon everywhere', text: 'Eligibility rules are written in dense official language, so people give up before they find out they qualify.' },
  { icon: HandCoins, title: 'Middlemen fees', text: 'Agents charge families money just to tell them about benefits that are already theirs, for free.' },
  { icon: FileX2, title: 'Wasted trips', text: 'One missing document means another day of lost wages and another trip back to the office.' }
]

const STEPS = [
  { img: goluWave, title: 'Tell Golu about your life', text: 'Type it the way you would say it, in English or Hinglish. "Main kisan hoon, 2 acre zameen" works perfectly.' },
  { img: goluHero, title: 'See schemes that fit you', text: 'Golu reads your situation, checks 33 central schemes and explains why each one matches, in plain words.' },
  { img: goluCheck, title: 'Tick off your documents', text: 'Every scheme has a documents checklist you can tick and save, so your first office visit is your last.' }
]

const FEATURES = [
  { icon: Languages, title: 'English and Hinglish', text: 'No forms or dropdowns. Describe your life in your own words, or speak it.' },
  { icon: Waypoints, title: 'Meaning, not keywords', text: 'Semantic search knows that "kheti", "kisan" and "farmer" mean the same thing.' },
  { icon: BookOpenCheck, title: 'Eligibility, decoded', text: 'Who qualifies and what you get, in short, clear sentences with the reason it fits you.' },
  { icon: ListChecks, title: 'Tickable checklist', text: 'Know exactly which documents to carry and track the ones you already have.' },
  { icon: Bookmark, title: 'Saved for later', text: 'Your checklist stays saved, so you can pick up right where you left off.' },
  { icon: ExternalLink, title: 'Straight to the source', text: 'Apply on the official government portal yourself. No agents, no fees.' }
]

const NAMES = SCHEMES.map((s) => shortName(s.name))

function Head({ eyebrow, title, text }) {
  return (
    <div className="lp-head">
      <span className="lp-eyebrow lp-reveal">{eyebrow}</span>
      <h2 className="lp-reveal">{title}</h2>
      {text && <p className="lp-reveal">{text}</p>}
    </div>
  )
}

export default function Landing() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const cap = root.current.querySelector('.lp-capsule')
        const max = parseFloat(getComputedStyle(cap).getPropertyValue('--cw-max')) || 2.1
        const round = 0.82

        // entrance
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .from('.lp-nav > *', { y: -20, opacity: 0, duration: 0.7, stagger: 0.08 })
          .from('.lp-kicker', { y: 16, opacity: 0, duration: 0.6 }, 0.15)
          .from('.lp-w', { yPercent: 60, opacity: 0, duration: 0.9, stagger: 0.12 }, 0.2)
          .fromTo(cap, { '--cw': 0.06 }, { '--cw': max, duration: 1.2, ease: 'expo.inOut' }, 0.35)
          .from('.lp-foot > *', { y: 20, opacity: 0, duration: 0.7, stagger: 0.1 }, 0.7)

        // capsule loop: wide pill -> circle -> thin line -> wide pill
        gsap
          .timeline({ repeat: -1, delay: 1.6, defaults: { ease: 'power3.inOut' } })
          .to(cap, { '--cw': round, duration: 1 }, '+=1.4')
          .to(cap, { '--cw': 0.06, duration: 0.8 }, '+=0.9')
          .to(cap, { '--cw': max, duration: 1.3, ease: 'expo.inOut' }, '+=0.5')

        // slow pan / zoom inside the capsule
        gsap.fromTo('.lp-capsule img', { scale: 1.05, xPercent: -50, x: -12 }, { scale: 1.22, x: 14, duration: 9, ease: 'sine.inOut', yoyo: true, repeat: -1 })

        // scroll reveals
        gsap.set('.lp-reveal', { opacity: 0 })
        ScrollTrigger.batch('.lp-reveal', {
          start: 'top 88%',
          once: true,
          onEnter: (els) => gsap.fromTo(els, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out' })
        })
        gsap.utils.toArray('.lp-problem').forEach((card, i) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 60, rotation: i % 2 ? 5 : -5, x: i % 2 ? 30 : -30 },
            { opacity: 1, y: 0, x: 0, rotation: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 90%', once: true } }
          )
        })
        gsap.fromTo('.lp-steps-line i', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.lp-steps', start: 'top 75%', end: 'bottom 60%', scrub: true } })
        gsap.utils.toArray('.lp-step').forEach((step) => {
          gsap
            .timeline({ scrollTrigger: { trigger: step, start: 'top 85%', once: true } })
            .fromTo(step, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
            .fromTo(step.querySelector('img'), { scale: 0.6, rotation: -8 }, { scale: 1, rotation: 0, duration: 0.9, ease: 'back.out(1.8)' }, '-=0.6')
        })
        gsap.fromTo('.lp-feature', { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '.lp-features', start: 'top 85%', once: true } })
        gsap
          .timeline({ scrollTrigger: { trigger: '.lp-diagram', start: 'top 80%', once: true } })
          .fromTo('.lp-node', { opacity: 0, y: 30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.35, ease: 'back.out(1.6)' })
          .fromTo('.lp-link', { '--fill': 0 }, { '--fill': 1, duration: 0.5, stagger: 0.35, ease: 'power2.out' }, 0.3)
        gsap.fromTo('.lp-demo', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: '.lp-demos', start: 'top 85%', once: true } })
        gsap.fromTo('.lp-cta-golu', { y: 80, opacity: 0, scale: 0.8 }, { y: 0, opacity: 1, scale: 1, duration: 1.1, ease: 'back.out(1.5)', scrollTrigger: { trigger: '.lp-cta', start: 'top 80%', once: true } })
      })
      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <div className="lp" ref={root}>
      {/* HERO */}
      <section className="lp-hero" id="top">
        <header className="lp-nav">
          <div className="lp-nav-left">
            <a href="#top" className="lp-brand">
              <img src={goluWave} alt="" width="34" height="34" />
              <span>Yojana Saathi</span>
            </a>
            <nav className="lp-links" aria-label="Sections">
              <a href="#how">How it works</a>
              <a href="#features">Features</a>
              <a href="#appwrite">Appwrite</a>
            </nav>
          </div>
          <div className="lp-hd-actions">
            <a className="lp-gh lp-yt" href={YOUTUBE_URL} target="_blank" rel="noreferrer" aria-label="Watch the demo on YouTube" title="Watch the demo on YouTube">
              <YoutubeIcon size={18} />
            </a>
            <a className="lp-gh" href={GITHUB_URL} target="_blank" rel="noreferrer">
              <GithubIcon size={16} /> GitHub
            </a>
          </div>
        </header>

        <div className="lp-stage">
          <p className="lp-kicker">Yojana</p>
          <h1 className="lp-word" aria-label="Saathi">
            <span className="lp-w" aria-hidden="true">
              SAA
            </span>
            <span className="lp-capsule" aria-hidden="true">
              <img src={sunset} alt="" width="1584" height="672" fetchpriority="high" />
            </span>
            <span className="lp-w" aria-hidden="true">
              THI
            </span>
          </h1>
          <p className="lp-sub">Your companion for government schemes</p>
        </div>

        <div className="lp-foot">
          <p className="lp-blurb">
            <span className="lp-drop">D</span>escribe your life in plain English or Hinglish. Golu finds the central government schemes you qualify for, explains why, and gives you a documents checklist.
          </p>
          <span className="lp-rule" aria-hidden="true" />
          <Link to="/app" className="lp-pill">
            Try it free, no sign-up <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="lp-section lp-container" id="problem">
        <Head
          eyebrow="The problem"
          title={
            <>
              Help exists. <span className="lp-grad">Finding it shouldn't be this hard.</span>
            </>
          }
          text="India runs hundreds of welfare schemes, yet millions of eligible families never claim what they are entitled to."
        />
        <div className="lp-grid4">
          {PROBLEMS.map(({ icon: Icon, title, text }) => (
            <article className="lp-problem lp-card" key={title}>
              <span className="lp-icon">
                <Icon size={22} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* HOW */}
      <section className="lp-section lp-container" id="how">
        <Head
          eyebrow="How it works"
          title={
            <>
              Three steps with <span className="lp-grad">Golu by your side</span>
            </>
          }
          text="Golu is a baby elephant, and elephants never forget. Neither will your checklist."
        />
        <div className="lp-steps">
          <div className="lp-steps-line" aria-hidden="true">
            <i />
          </div>
          {STEPS.map((s, i) => (
            <article className="lp-step lp-card" key={s.title}>
              <div className="lp-step-art">
                <span className="lp-step-num">0{i + 1}</span>
                <img src={s.img} alt="" loading="lazy" width="480" height="507" />
              </div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* DEMOS */}
      <section className="lp-section lp-container" id="demo">
        <Head
          eyebrow="See it in action"
          title={
            <>
              From one sentence <span className="lp-grad">to a clear plan</span>
            </>
          }
          text="A Hinglish query, a thoughtful answer, matched schemes and a saved checklist. Same app on desktop and on a phone."
        />
        <Demos />
      </section>

      {/* FEATURES */}
      <section className="lp-section lp-container" id="features">
        <Head
          eyebrow="Features"
          title={
            <>
              Everything you need, <span className="lp-grad">nothing you don't</span>
            </>
          }
        />
        <div className="lp-features">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <article className="lp-feature lp-card" key={title}>
              <span className="lp-icon">
                <Icon size={20} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* APPWRITE */}
      <section className="lp-section lp-container" id="appwrite">
        <Head
          eyebrow="Powered by Appwrite Databases"
          title={
            <>
              Semantic search meets <span className="lp-grad">structured data</span>
            </>
          }
          text="VectorsDB understands what you mean. TablesDB holds every scheme's details and remembers your checklist."
        />
        <div className="lp-diagram lp-card">
          <div className="lp-node">
            <span className="lp-icon">
              <MessageSquareText size={22} />
            </span>
            <strong>Your words</strong>
            <small>"meri beti ke liye savings scheme"</small>
          </div>
          <div className="lp-link" aria-hidden="true" />
          <div className="lp-node hot">
            <span className="lp-icon">
              <Search size={22} />
            </span>
            <strong>VectorsDB</strong>
            <small>Embeds the query with built-in nomic-embed-text and finds the closest schemes by meaning</small>
          </div>
          <div className="lp-link" aria-hidden="true" />
          <div className="lp-node">
            <span className="lp-icon">
              <Table2 size={22} />
            </span>
            <strong>TablesDB</strong>
            <small>Scheme details, eligibility, documents and your private saved checklist</small>
          </div>
        </div>
        <div className="lp-pills lp-reveal">
          <span className="lp-chip">
            <Database size={14} /> Appwrite TablesDB
          </span>
          <span className="lp-chip">
            <Waypoints size={14} /> Appwrite VectorsDB
          </span>
        </div>
      </section>

      {/* SCHEMES */}
      <section className="lp-section" id="schemes">
        <div className="lp-container">
          <Head
            eyebrow="33 schemes inside"
            title={
              <>
                From farms to first homes, <span className="lp-grad">covered</span>
              </>
            }
          />
        </div>
        {[NAMES, NAMES.slice().reverse()].map((list, row) => (
          <div className={`lp-marquee ${row ? 'reverse' : ''}`} key={row}>
            <div className="lp-track">
              {[...list, ...list].map((n, i) => (
                <span className="lp-chip" key={i} aria-hidden={row > 0 || i >= list.length}>
                  <span className="lp-dot" /> {n}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="lp-section lp-container">
        <div className="lp-cta lp-card">
          <img className="lp-cta-golu" src={goluCelebrate} alt="Golu the baby elephant celebrating" loading="lazy" width="480" height="492" />
          <div>
            <h2 className="lp-reveal">
              Find what's yours <span className="lp-grad">in under a minute.</span>
            </h2>
            <p className="lp-reveal">No agents, no fees, no jargon. Just tell Golu about your life.</p>
            <div className="lp-ctas lp-reveal">
              <Link to="/app" className="lp-pill">
                Try it free, no sign-up <ArrowRight size={18} />
              </Link>
              <a className="lp-ghost" href={GITHUB_URL} target="_blank" rel="noreferrer">
                <GithubIcon /> View on GitHub
              </a>
              <a className="lp-ghost" href={YOUTUBE_URL} target="_blank" rel="noreferrer">
                <YoutubeIcon /> Watch demo
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="lp-footer lp-container">
        <div className="lp-brand">
          <img src={goluWave} alt="" width="30" height="30" loading="lazy" />
          <span>Yojana Saathi</span>
        </div>
        <p>
          Built for the Appwrite Databases Hackathon 2026 <Heart size={13} className="lp-heart" /> MIT License
        </p>
        <p className="lp-note">Not affiliated with the Government of India. Always confirm details on the official scheme portal.</p>
      </footer>
    </div>
  )
}
