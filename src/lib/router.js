// A tiny client-side router: two routes ("/" landing, "/app" the app), no dependency needed.
import { createElement, useEffect, useState } from 'react'

export function navigate(to) {
  if (to === window.location.pathname) return
  window.history.pushState({}, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo(0, 0)
}

export function usePath() {
  const [path, setPath] = useState(() => window.location.pathname)
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  return path
}

/** <a> that navigates without a full reload (modifier clicks still open a new tab). */
export function Link({ to, onClick, ...props }) {
  return createElement('a', {
    ...props,
    href: to,
    onClick: (e) => {
      onClick?.(e)
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
      e.preventDefault()
      navigate(to)
    }
  })
}
