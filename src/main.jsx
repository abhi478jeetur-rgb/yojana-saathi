import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/plus-jakarta-sans/400.css'
import '@fontsource/plus-jakarta-sans/500.css'
import '@fontsource/plus-jakarta-sans/600.css'
import '@fontsource/plus-jakarta-sans/700.css'
import '@fontsource/plus-jakarta-sans/800.css'
import './styles.css'
import { usePath } from './lib/router.js'

const App = lazy(() => import('./App.jsx'))
const Landing = lazy(() => import('./landing/Landing.jsx'))

function Root() {
  const path = usePath()
  const isApp = path === '/app' || path.startsWith('/app/')
  return <Suspense fallback={<div className="route-loading" />}>{isApp ? <App /> : <Landing />}</Suspense>
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
)
