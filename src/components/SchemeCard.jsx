import { useState } from 'react'
import { Bookmark, BookmarkCheck, ChevronDown, ExternalLink, Check, Gift, UserCheck, FileText, ShieldAlert } from 'lucide-react'
import { matchLabel } from '../lib/search/match.js'
import { press } from '../lib/motion.js'

export default function SchemeCard({ scheme: s, match, checklist, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const saved = checklist.isSaved(s.id)
  const done = checklist.done(s.id)
  const pct = s.documents.length ? Math.round((done.length / s.documents.length) * 100) : 0

  return (
    <article className={`scheme-card glass ${open ? 'open' : ''}`}>
      <div className="card-top">
        <span className="cat">{s.category}</span>
        {match && <span className={`match m${Math.round(match.relevance * 2)}`}>{matchLabel(match.relevance)}</span>}
      </div>
      <h3>{s.name}</h3>
      <p className="summary">{s.summary}</p>
      {match?.reason && <p className="why">{match.reason}</p>}

      {saved && s.documents.length > 0 && (
        <div className="progress" aria-label={`${pct}% documents ready`}>
          <span style={{ width: `${pct}%` }} />
        </div>
      )}

      <div className="card-actions">
        <button className="btn-ghost" onClick={() => setOpen(!open)} aria-expanded={open} onPointerDown={press}>
          {open ? 'Hide details' : 'See details'} <ChevronDown size={18} className={open ? 'rot' : ''} />
        </button>
        <button className={`btn-save ${saved ? 'on' : ''}`} onClick={() => checklist.toggleSave(s.id)} onPointerDown={press} aria-pressed={saved}>
          {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>

      {open && (
        <div className="details">
          <section>
            <h4>
              <Gift size={18} /> What you get
            </h4>
            <p>{s.benefits}</p>
          </section>
          <section>
            <h4>
              <UserCheck size={18} /> Who can apply
            </h4>
            <p>{s.eligibility}</p>
          </section>
          <section>
            <h4>
              <FileText size={18} /> Documents to keep ready{' '}
              <small>
                {done.length}/{s.documents.length}
              </small>
            </h4>
            <ul className="docs">
              {s.documents.map((d, i) => {
                const on = done.includes(i)
                return (
                  <li key={d}>
                    <button className={on ? 'on' : ''} onClick={() => checklist.toggleDoc(s.id, i)} aria-pressed={on}>
                      <span className="box">{on && <Check size={16} strokeWidth={3} />}</span>
                      {d}
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
          <a className="btn-primary" href={s.apply_url} target="_blank" rel="noreferrer" onPointerDown={press}>
            Apply on official site <ExternalLink size={18} />
          </a>
          <p className="verify">
            <ShieldAlert size={16} /> Rules and amounts can change. Please verify on the{' '}
            <a href={s.source_url} target="_blank" rel="noreferrer">
              official site
            </a>
            . Applying is free; never pay a middleman. <span className="ministry">{s.ministry}</span>
          </p>
        </div>
      )}
    </article>
  )
}
