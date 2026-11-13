import { lazy, Suspense } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import App from './App'

const Documentation = lazy(() => import('./docs/Documentation'))

function NotFound() {
  return <main className="route-message"><span className="mono">404 / PAGE NOT FOUND</span><h1>This path doesn't exist.</h1><p>Find your next step in the developer documentation.</p><Link className="button button-lime" to="/docs">Open documentation</Link><Link to="/">Back to website</Link></main>
}

export default function SiteRoutes() {
  return <Suspense fallback={<div className="route-message" role="status">Loading documentation...</div>}>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/docs/:slug?" element={<Documentation />} />
      <Route path="/docs/typescript/:slug?" element={<Documentation track="typescript" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
}
