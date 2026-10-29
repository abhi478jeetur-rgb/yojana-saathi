import { ListChecks, Search } from 'lucide-react'
import SchemeCard from './SchemeCard.jsx'
import { press } from '../lib/motion.js'

export default function Checklist({ schemes, checklist, onFind }) {
  const saved = schemes.filter((s) => checklist.isSaved(s.id))
  const totalDocs = saved.reduce((n, s) => n + s.documents.length, 0)
  const ready = saved.reduce((n, s) => n + checklist.done(s.id).length, 0)

  return (
    <div>
      <h1 className="page-title">My checklist</h1>
      {saved.length === 0 ? (
        <div className="empty glass center">
          <ListChecks size={44} className="accent" />
          <h2>Nothing saved yet</h2>
          <p>Tap "Save" on any scheme to keep its document checklist here. Your ticks are saved on this device.</p>
          <button className="btn-primary" onClick={onFind} onPointerDown={press}>
            <Search size={20} /> Find schemes
          </button>
        </div>
      ) : (
        <>
          <div className="stat glass">
            <div>
              <b>{saved.length}</b>
              <span>saved schemes</span>
            </div>
            <div>
              <b>
                {ready}/{totalDocs}
              </b>
              <span>documents ready</span>
            </div>
          </div>
          <div className="card-grid">
            {saved.map((s) => (
              <SchemeCard key={s.id} scheme={s} checklist={checklist} defaultOpen />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
