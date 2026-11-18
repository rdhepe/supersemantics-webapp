import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { after, test } from 'node:test'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
after(() => server.close())
const { docPages, docHref, docSearchIndex } = await server.ssrLoadModule('/src/docs/content.ts')
const { docTracks } = await server.ssrLoadModule('/src/docs/tracks.ts')
const destinations = new Set(Object.entries(docTracks).flatMap(([track, { pages }]) =>
  pages.flatMap(page => [
    docHref(page.slug, track),
    ...page.sections.map(section => `${docHref(page.slug, track)}#${section.id}`),
  ]),
))

test('guides have unique routes, section anchors, and upstream references', () => {
  assert.equal(docPages.length, 9)
  assert.equal(new Set(docPages.map(page => page.slug)).size, docPages.length)
  for (const page of docPages) {
    assert.ok(page.title && page.description && page.sections.length && page.sources.length)
    assert.equal(new Set(page.sections.map(section => section.id)).size, page.sections.length)
    for (const section of page.sections) {
      assert.match(section.id, /^[a-z0-9-]+$/)
      assert.ok(section.blocks.length)
    }
    for (const source of page.sources) {
      assert.equal(new URL(source.href).hostname, 'github.com')
    }
  }
})

test('Python learning cards and search results resolve to real guides and sections', () => {
  for (const page of docPages) {
    for (const section of page.sections) {
      for (const block of section.blocks) {
        if (block.type !== 'links') continue
        for (const item of block.items) {
          if (item.href.startsWith('/')) assert.ok(destinations.has(item.href), item.href)
        }
      }
    }
  }
  assert.equal(docSearchIndex.length, docPages.reduce((count, page) => count + page.sections.length, 0))
  for (const entry of docSearchIndex) {
    assert.ok(destinations.has(entry.href), entry.href)
    assert.equal(entry.text, entry.text.toLowerCase())
    assert.ok(entry.text.includes(entry.section.toLowerCase()))
  }
  assert.ok(docSearchIndex.some(entry => entry.text.includes('gammaestimate')))
  assert.ok(docSearchIndex.some(entry => entry.text.includes('langgraph')))
})

test('TS/JS guides have distinct routes, anchors, sources, and complete local search', () => {
  const { pages, searchIndex } = docTracks.typescript
  assert.equal(pages.length, 8)
  assert.equal(new Set(pages.map(page => page.slug)).size, pages.length)
  assert.equal(docHref('introduction', 'typescript'), '/docs/typescript')
  assert.equal(docHref('first-gate'), '/docs/first-gate')
  assert.equal(docHref('first-gate', 'typescript'), '/docs/typescript/first-gate')
  for (const page of pages) {
    assert.ok(page.title && page.description && page.sections.length && page.sources.length)
    assert.equal(new Set(page.sections.map(section => section.id)).size, page.sections.length)
    for (const section of page.sections) {
      assert.match(section.id, /^[a-z0-9-]+$/)
      assert.ok(section.blocks.length)
      for (const block of section.blocks) {
        if (block.type !== 'links') continue
        for (const item of block.items) {
          if (item.href.startsWith('/')) assert.ok(destinations.has(item.href), item.href)
        }
      }
    }
    for (const source of page.sources) assert.equal(new URL(source.href).hostname, 'github.com')
  }
  assert.equal(searchIndex.length, pages.reduce((count, page) => count + page.sections.length, 0))
  for (const entry of searchIndex) {
    assert.ok(destinations.has(entry.href), entry.href)
    assert.ok(entry.href.startsWith('/docs/typescript'))
    assert.equal(entry.text, entry.text.toLowerCase())
    assert.ok(entry.text.includes(entry.section.toLowerCase()))
  }
  assert.ok(searchIndex.some(entry => entry.text.includes('plainjsreferenceadapter')))
  assert.ok(searchIndex.some(entry => entry.text.includes('gatednode')))
  assert.ok(searchIndex.some(entry => entry.text.includes('it policy')))
  assert.ok(docTracks.python.searchIndex.every(entry => !entry.href.startsWith('/docs/typescript')))
})

test('TS and JS downloadable examples match displayed source, including language tabs', async () => {
  const downloads = docTracks.typescript.pages.flatMap(page => page.sections.flatMap(section =>
    section.blocks.flatMap(block => {
      if (block.type === 'code' && block.download) return [block.sample]
      if (block.type === 'code-group') return block.samples.filter(sample => sample.download)
      return []
    }),
  ))
  assert.equal(downloads.length, 7)
  assert.equal(new Set(downloads.map(sample => sample.label)).size, 7)
  for (const sample of downloads) {
    assert.match(sample.label, /^[a-z_]+\.(ts|mjs)$/)
    assert.equal(sample.language, sample.label.endsWith('.ts') ? 'typescript' : 'javascript')
    assert.equal(sample.code, await readFile(new URL(`../src/docs/examples/tsjs/${sample.label}`, import.meta.url), 'utf8'))
  }
})

test('.NET guides and search stay within their track and resolve every learning link', () => {
  const { pages, searchIndex } = docTracks.dotnet
  assert.equal(docHref('introduction', 'dotnet'), '/docs/dotnet')
  assert.equal(docHref('installation', 'dotnet'), '/docs/dotnet/installation')
  assert.equal(new Set(pages.map(page => page.slug)).size, pages.length)
  for (const slug of ['introduction', 'installation', 'first-gate', 'thresholds', 'ledger', 'testing', 'integrations', 'reference']) {
    assert.ok(pages.some(page => page.slug === slug), `Missing .NET guide: ${slug}`)
  }
  for (const page of pages) {
    assert.ok(page.title && page.description && page.sections.length && page.sources.length)
    assert.equal(new Set(page.sections.map(section => section.id)).size, page.sections.length)
    for (const section of page.sections) {
      assert.match(section.id, /^[a-z0-9-]+$/)
      assert.ok(section.blocks.length)
      for (const block of section.blocks) {
        if (block.type !== 'links') continue
        for (const item of block.items) {
          if (item.href.startsWith('/')) {
            assert.ok(item.href.startsWith('/docs/dotnet'), item.href)
            assert.ok(destinations.has(item.href), item.href)
          }
        }
      }
    }
    for (const source of page.sources) {
      const url = new URL(source.href)
      assert.equal(url.hostname, 'github.com')
      assert.match(url.pathname, /^\/supersemantics\/VSL-(Core|Microsoft-agent-framework)\.NET\//)
    }
  }
  assert.equal(searchIndex.length, pages.reduce((count, page) => count + page.sections.length, 0))
  for (const entry of searchIndex) {
    assert.ok(entry.href.startsWith('/docs/dotnet'), entry.href)
    assert.ok(destinations.has(entry.href), entry.href)
    assert.equal(entry.text, entry.text.toLowerCase())
    assert.ok(entry.text.includes(entry.section.toLowerCase()))
  }
  for (const term of ['invariantviolationexception', 'usevslgates', 'net10.0', 'vslgatedeniedexception', 'maxmonitorgapseconds']) {
    assert.ok(searchIndex.some(entry => entry.text.includes(term)), term)
  }
  for (const track of ['python', 'typescript']) {
    assert.ok(docTracks[track].searchIndex.every(entry => !entry.href.startsWith('/docs/dotnet')))
  }
})

test('.NET downloads contain the complete console project and match displayed source', async () => {
  const blocks = docTracks.dotnet.pages.flatMap(page => page.sections.flatMap(section =>
    section.blocks.filter(block => block.type === 'code' && block.download),
  ))
  const expectedFiles = ['VslGuide.csproj', 'Program.cs', 'RefundPolicy.cs', 'ThresholdPolicy.cs', 'LedgerEvidence.cs', 'GateChecks.cs']
  assert.deepEqual(blocks.map(block => block.sample.label).sort(), expectedFiles.sort())
  for (const block of blocks) {
    const { label, language, code } = block.sample
    assert.equal(language, label.endsWith('.cs') ? 'csharp' : 'markup')
    assert.ok(block.download.includes(label), block.download)
    assert.equal(code, await readFile(new URL(`../src/docs/examples/dotnet/${label}`, import.meta.url), 'utf8'))
  }
})

test('downloadable Python examples match their displayed source', async () => {
  const examples = docPages.flatMap(page => page.sections.flatMap(section =>
    section.blocks.filter(block => block.type === 'code' && block.download),
  ))
  assert.equal(examples.length, 4)
  for (const block of examples) {
    assert.equal(block.sample.language, 'python')
    assert.equal(block.sample.code, await readFile(new URL(`../src/docs/examples/${block.sample.label}`, import.meta.url), 'utf8'))
  }
})
