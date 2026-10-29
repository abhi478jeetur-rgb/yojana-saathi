import { useEffect, useState } from 'react'
import golu from '../assets/golu/golu-wave.webp'

const STEPS = ['Understanding your situation…', 'Checking 33 central schemes…', 'Matching eligibility…', 'Picking the best fits…']

export default function Thinking() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((n) => Math.min(n + 1, STEPS.length - 1)), 480)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="thinking" role="status" aria-live="polite">
      <div className="chat-row">
        <span className="avatar thinking-avatar">
          <img src={golu} alt="" width="44" height="44" />
        </span>
        <div className="chat-bubble bot">
          <span className="think-step" key={i}>
            {STEPS[i]}
          </span>
          <span className="dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </div>
      </div>
      {[0, 1, 2].map((n) => (
        <div className="skeleton glass" key={n} aria-hidden="true">
          <span className="sk sk-tag" />
          <span className="sk sk-title" />
          <span className="sk sk-line" />
          <span className="sk sk-line short" />
        </div>
      ))}
    </div>
  )
}
