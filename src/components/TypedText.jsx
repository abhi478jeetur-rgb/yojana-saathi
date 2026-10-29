import { useEffect, useState } from 'react'
import { reduceMotion } from '../lib/motion.js'

/** Types text out word by word, then calls onDone. Shows it all at once for reduced motion. */
export default function TypedText({ text, speed = 55, onDone }) {
  const words = text.split(' ')
  const instant = reduceMotion()
  const [n, setN] = useState(instant ? words.length : 0)

  useEffect(() => {
    if (instant) {
      onDone?.()
      return
    }
    let i = 0
    const t = setInterval(() => {
      i++
      setN(i)
      if (i >= words.length) {
        clearInterval(t)
        onDone?.()
      }
    }, speed)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  return (
    <span className="typed" aria-label={text}>
      <span aria-hidden="true">{words.slice(0, n).join(' ')}</span>
      {n < words.length && <span className="caret" aria-hidden="true" />}
    </span>
  )
}
