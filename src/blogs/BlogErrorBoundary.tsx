import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

export default class BlogErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unable to load blog content:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <section id="blogs" tabIndex={-1} className="container section-space" role="alert">
          <h2>Blogs could not be loaded</h2>
          <p>There is a problem with the blog content. Please try again after it has been corrected.</p>
          {import.meta.env.DEV && <p>{this.state.error.message}</p>}
          <button type="button" className="button button-lime" onClick={() => window.location.reload()}>Reload page</button>
          <a className="text-link" href="/">Back to homepage</a>
        </section>
      )
    }
    return this.props.children
  }
}
