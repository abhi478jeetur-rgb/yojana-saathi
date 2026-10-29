import { useEffect, useRef } from 'react'

const CLIPS = [
  { kind: 'desktop', src: '/videos/demo-desktop.mp4', poster: '/videos/demo-desktop-poster.jpg', label: 'Desktop demo', w: 1440, h: 900 },
  { kind: 'mobile', src: '/videos/demo-mobile.mp4', poster: '/videos/demo-mobile-poster.jpg', label: 'Mobile demo', w: 390, h: 844 }
]

/** Autoplaying, muted, looping clip that only loads once it scrolls into view. */
function LazyVideo({ src, poster, label, w, h }) {
  const ref = useRef(null)
  useEffect(() => {
    const v = ref.current
    if (!v || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!v.src) v.src = src
          v.play().catch(() => {})
        } else if (v.src) v.pause()
      },
      { rootMargin: '200px' }
    )
    io.observe(v)
    return () => io.disconnect()
  }, [src])
  return <video ref={ref} poster={poster} muted loop playsInline preload="none" aria-label={label} width={w} height={h} />
}

export default function Demos() {
  const [desk, mob] = CLIPS
  return (
    <div className="lp-demos">
      <figure className="lp-demo lp-browser">
        <div className="lp-browser-bar" aria-hidden="true">
          <i />
          <i />
          <i />
          <span>yojana-saathi.appwrite.network/app</span>
        </div>
        <LazyVideo {...desk} />
        <figcaption>Desktop, 1440 × 900</figcaption>
      </figure>
      <figure className="lp-demo lp-phone">
        <div className="lp-phone-body">
          <span className="lp-notch" aria-hidden="true" />
          <LazyVideo {...mob} />
        </div>
        <figcaption>Mobile, 390 × 844</figcaption>
      </figure>
    </div>
  )
}
