import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { blogPosts, formatBlogDate } from './content'
import type { BlogPost } from './content'
import './blogs.css'

export function BlogCards({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return <p className="blogs-empty">Our first articles are on their way. Check back soon.</p>
  return (
    <div className="blog-cards">
      {posts.map(post => (
        <article className="blog-card" key={post.slug}>
          <div className="blog-meta mono"><time dateTime={post.date}>{formatBlogDate(post.date)}</time><span>{post.author}</span></div>
          <h3><Link to={`/blogs/${post.slug}`}>{post.title}<ArrowUpRight size={20} aria-hidden="true" /></Link></h3>
          <p>{post.description}</p>
        </article>
      ))}
    </div>
  )
}

export function BlogPreview() {
  return (
    <section className="blogs-preview section-space" id="blogs" tabIndex={-1} aria-labelledby="blogs-heading">
      <div className="container">
        <div className="section-heading">
          <div><div className="section-label mono label-light">FROM THE TEAM</div><h2 id="blogs-heading">Blogs</h2></div>
          <Link className="text-link" to="/blogs">View all blogs <ArrowUpRight size={17} aria-hidden="true" /></Link>
        </div>
        <BlogCards posts={blogPosts.slice(0, 3)} />
      </div>
    </section>
  )
}
