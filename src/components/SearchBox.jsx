import { useRef, useState } from 'react'
import { Mic, MicOff, Search, Loader2 } from 'lucide-react'
import { EXAMPLES } from '../data/schemes.js'
import { press } from '../lib/motion.js'

const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)

export default function SearchBox({ value, onChange, onSubmit, loading }) {
  const [listening, setListening] = useState(false)
  const recRef = useRef(null)

  function toggleMic() {
    if (listening) return recRef.current?.stop()
    const rec = new SpeechRecognition()
    rec.lang = 'en-IN'
    rec.interimResults = true
    rec.onresult = (e) => onChange([...e.results].map((r) => r[0].transcript).join(' '))
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recRef.current = rec
    rec.start()
    setListening(true)
  }

  const submit = (e) => {
    e.preventDefault()
    onSubmit(value)
  }

  return (
    <form className="search glass" onSubmit={submit}>
      <label htmlFor="q" className="sr-only">
        Describe your situation
      </label>
      <div className="search-field">
        <textarea
          id="q"
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && submit(e)}
          placeholder="Example: I am a farmer with 2 acres and my daughter is going to college"
        />
        {SpeechRecognition && (
          <button type="button" className={`mic ${listening ? 'on' : ''}`} onClick={toggleMic} aria-label={listening ? 'Stop listening' : 'Speak instead of typing'}>
            {listening ? <MicOff size={22} /> : <Mic size={22} />}
          </button>
        )}
      </div>
      <button type="submit" className="btn-primary" onPointerDown={press} disabled={loading || !value.trim()}>
        {loading ? <Loader2 className="spin" size={22} /> : <Search size={22} />}
        Find my schemes
      </button>
      <div className="chips" aria-label="Try an example">
        <span className="chips-title">Try an example:</span>
        {EXAMPLES.map((ex) => (
          <button
            type="button"
            key={ex}
            className="chip"
            onPointerDown={press}
            onClick={() => {
              onChange(ex)
              onSubmit(ex)
            }}
          >
            {ex}
          </button>
        ))}
      </div>
    </form>
  )
}
