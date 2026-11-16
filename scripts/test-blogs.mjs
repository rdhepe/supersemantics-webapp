import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import { after, test } from 'node:test'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
after(() => server.close())
const { blogPosts, loadBlogPosts, parseBlogPost } = await server.ssrLoadModule('/src/blogs/content.ts')

function article(metadata = '', body = 'Article body.') {
  return `---\ntitle: "Test article"\ndescription: "A short summary."\nauthor: "Test author"\ndate: "2026-11-14"\n${metadata}---\n${body}`
}

test('Markdown files are automatically discovered with filename-derived URLs', async () => {
  const directory = new URL('../src/blogs/posts/', import.meta.url)
  const filenames = (await readdir(directory)).filter(name => /\.(md|MD)$/.test(name))
  assert.equal(blogPosts.length, filenames.length)
  for (const filename of filenames) {
    const source = await readFile(new URL(filename, directory), 'utf8')
    const expected = parseBlogPost(filename, source)
    assert.deepEqual(blogPosts.find(post => post.slug === expected.slug), expected)
  }
  assert.equal(parseBlogPost('another-article.MD', article()).slug, 'another-article')
})

test('copied Markdown filenames with spaces become hyphenated URLs without collisions', () => {
  const post = parseBlogPost('./posts/why-boundaries copy.md', article())
  assert.equal(post.slug, 'why-boundaries-copy')
  assert.equal(parseBlogPost('another  copy.MD', article()).slug, 'another-copy')
  assert.equal(loadBlogPosts({ 'why-boundaries.md': article(), 'why-boundaries copy.md': article() }).length, 2)
  assert.throws(() => loadBlogPosts({ 'same copy.md': article(), 'same-copy.md': article() }), /duplicate blog slug/)
})

test('frontmatter is removed while Markdown content is preserved, including Windows line endings', () => {
  const body = '## Heading\n\n**Bold** and [a link](/docs).\n\n```ts\nconst value = 1\n```'
  const post = parseBlogPost('test-article.md', `\uFEFF${article('', body).replaceAll('\n', '\r\n')}`)
  assert.equal(post.body, body.replaceAll('\n', '\r\n'))
  assert.equal(post.title, 'Test article')
})

test('invalid metadata, dates, filenames, and empty articles fail explicitly', () => {
  assert.throws(() => parseBlogPost('test.md', 'Missing metadata'), /YAML metadata/)
  assert.throws(() => parseBlogPost('Bad Name.md', article()), /filename/)
  assert.throws(() => parseBlogPost('test.md', article().replace('title: "Test article"', 'title: ""')), /"title"/)
  assert.throws(() => parseBlogPost('test.md', article().replace('author: "Test author"\n', '')), /"author"/)
  assert.throws(() => parseBlogPost('test.md', article().replace('"2026-11-14"', '"2026-02-30"')), /calendar date/)
  assert.throws(() => parseBlogPost('test.md', article().replace('"2026-11-14"', '42')), /"date"/)
  assert.throws(() => parseBlogPost('test.md', article('title: "Duplicate"\n')), /duplicate/i)
  assert.throws(() => parseBlogPost('test.md', article('', '  ')), /article content/)
})

test('posts sort newest first and duplicate URLs are rejected', () => {
  const posts = loadBlogPosts({
    'older.md': article().replace('"2026-11-14"', '"2026-11-01"'),
    'newer.md': article(),
  })
  assert.deepEqual(posts.map(post => post.slug), ['newer', 'older'])
  assert.throws(() => loadBlogPosts({ 'same.md': article(), 'same.MD': article() }), /duplicate blog slug/)
  assert.deepEqual(loadBlogPosts({}), [])
})
