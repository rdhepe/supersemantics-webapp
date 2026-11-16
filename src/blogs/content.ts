import { parseDocument } from 'yaml'

export interface BlogPost {
  slug: string
  title: string
  description: string
  author: string
  date: string
  body: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function parseBlogPost(filename: string, source: string): BlogPost {
  const name = filename.match(/(?:^|\/)([a-z0-9]+(?:[- ]+[a-z0-9]+)*)\.(?:md|MD)$/)?.[1]
  if (!name) throw new Error(`${filename}: use a lowercase filename with words separated by spaces or hyphens, ending in .md or .MD.`)
  const slug = name.replace(/[- ]+/g, '-')

  const content = source.replace(/^\uFEFF/, '')
  const frontmatter = content.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/)
  if (!frontmatter) throw new Error(`${filename}: add YAML metadata between --- lines at the start of the file.`)
  const document = parseDocument(frontmatter[1])
  if (document.errors.length) throw new Error(`${filename}: ${document.errors.map(error => error.message).join('; ')}`)
  const parsedMetadata: unknown = document.toJS()
  if (!isRecord(parsedMetadata)) throw new Error(`${filename}: metadata must be a YAML mapping.`)
  const metadata = parsedMetadata

  function required(key: string): string {
    const value = metadata[key]
    if (typeof value !== 'string' || !value.trim()) throw new Error(`${filename}: "${key}" must be a non-empty string.`)
    return value.trim()
  }

  const title = required('title')
  const description = required('description')
  const author = required('author')
  const date = required('date')
  const parsedDate = new Date(`${date}T00:00:00Z`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) {
    throw new Error(`${filename}: "date" must be a valid YYYY-MM-DD calendar date.`)
  }
  const body = content.slice(frontmatter[0].length).trim()
  if (!body) throw new Error(`${filename}: add Markdown article content after the metadata.`)
  return { slug, title, description, author, date, body }
}

export function loadBlogPosts(files: Record<string, string>): BlogPost[] {
  const slugs = new Set<string>()
  const posts = Object.entries(files).map(([filename, source]) => {
    const post = parseBlogPost(filename, source)
    if (slugs.has(post.slug)) throw new Error(`${filename}: duplicate blog slug "${post.slug}".`)
    slugs.add(post.slug)
    return post
  })
  return posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug))
}

export const blogPosts = loadBlogPosts(import.meta.glob<string>('./posts/*.{md,MD}', {
  query: '?raw',
  import: 'default',
  eager: true,
}))

const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' })

export function formatBlogDate(date: string): string {
  return dateFormat.format(new Date(`${date}T00:00:00Z`))
}
