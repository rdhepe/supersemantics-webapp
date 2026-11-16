import { useEffect } from 'react'
import Markdown from 'react-markdown'
import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import Brand from '../Brand'
import { links } from '../content'
import { BlogCards } from './BlogCards'
import { blogPosts, formatBlogDate } from './content'

export default function Blogs() {
  const { slug } = useParams()
  const post = slug ? blogPosts.find(item => item.slug === slug) : undefined
  const missing = Boolean(slug && !post)
  const title = missing ? 'Blog not found' : post?.title ?? 'Blogs'
  const description = post?.description ?? 'Ideas and practical notes on autonomous systems and computable governance from the Super Semantics team.'

  useEffect(() => {
    const pageTitle = document.querySelector<HTMLTitleElement>('title')
    const previousTitle = pageTitle?.textContent
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const previousDescription = meta?.content
    if (pageTitle) pageTitle.textContent = `${title} | Super Semantics`
    if (meta) meta.content = description
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.getElementById('blog-main')?.focus({ preventScroll: true })
    return () => {
      if (pageTitle) pageTitle.textContent = previousTitle ?? ''
      if (meta && previousDescription !== undefined) meta.content = previousDescription
    }
  }, [slug, title, description])

  return (
    <div className="blogs-page">
      <a className="skip-link" href="#blog-main">Skip to content</a>
      <header className="site-header">
        <div className="container blog-header">
          <Brand href="/" />
          <nav aria-label="Blog navigation"><Link to="/">Home</Link><Link to="/blogs">Blogs</Link><Link to="/docs">Docs</Link></nav>
        </div>
      </header>
      <main id="blog-main" tabIndex={-1} className="container blog-main">
        {missing ? (
          <div className="blogs-intro"><span className="mono lime-text">404 / BLOG NOT FOUND</span><h1>That article doesn't exist.</h1><p>Explore the latest posts from our team.</p><Link className="button button-lime" to="/blogs">View all blogs</Link></div>
        ) : post ? (
          <article className="blog-article">
            <Link className="text-link" to="/blogs"><ArrowLeft size={17} aria-hidden="true" />All blogs</Link>
            <header className="blog-article-header">
              <div className="blog-meta mono"><time dateTime={post.date}>{formatBlogDate(post.date)}</time><span>{post.author}</span></div>
              <h1>{post.title}</h1>
              <p>{post.description}</p>
            </header>
            <div className="blog-prose"><Markdown skipHtml>{post.body}</Markdown></div>
          </article>
        ) : (
          <>
            <div className="blogs-intro"><span className="mono lime-text">FROM THE TEAM</span><h1>Blogs</h1><p>{description}</p></div>
            <BlogCards posts={blogPosts} />
          </>
        )}
      </main>
      <footer className="container blog-footer"><Brand footer href="/" /><a href={links.email}>Get in touch</a></footer>
    </div>
  )
}
