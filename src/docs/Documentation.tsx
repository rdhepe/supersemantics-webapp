import { Fragment, useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Highlight } from 'prism-react-renderer'
import type { PrismTheme } from 'prism-react-renderer'
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronRight, Code2, Copy, Download, FileCode2, GitFork as Github, Hash, Info, Menu, Search, ShieldCheck, Sparkles, TriangleAlert, X } from 'lucide-react'
import Brand from '../Brand'
import { links } from '../content'
import { docHref } from './content'
import type { CodeSample, DocBlock, DocPage } from './content'
import { docTracks } from './tracks'
import type { DocTrack } from './tracks'
import './docs.css'

const codeTheme: PrismTheme = {
  plain: { color: '#d9e3ce', backgroundColor: '#171e15' },
  styles: [
    { types: ['comment', 'prolog'], style: { color: '#a0ae92', fontStyle: 'italic' } },
    { types: ['keyword', 'builtin'], style: { color: '#d0fa82' } },
    { types: ['string', 'char'], style: { color: '#e1d59d' } },
    { types: ['number', 'boolean'], style: { color: '#c4b8ef' } },
    { types: ['function', 'class-name'], style: { color: '#a9dbca' } },
    { types: ['operator', 'punctuation'], style: { color: '#b5c3a7' } },
  ],
}

function DocLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return href.startsWith('/')
    ? <Link to={href} className={className}>{children}</Link>
    : <a href={href} className={className} target="_blank" rel="noreferrer">{children}</a>
}

function CodeBlock({ sample, download }: { sample: CodeSample; download?: string }) {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  async function copy() {
    setError('')
    setCopied(false)
    clearTimeout(timer.current)
    if (!navigator.clipboard) {
      setError('Clipboard is unavailable. Select the code and copy it manually.')
      return
    }
    try {
      await navigator.clipboard.writeText(sample.code.trim())
      setCopied(true)
      timer.current = setTimeout(() => setCopied(false), 2000)
    } catch (cause) {
      console.error('Could not copy documentation code:', cause)
      setError('Could not copy. Select the code and copy it manually.')
    }
  }

  return (
    <div className="docs-code">
      <div className="docs-code-header"><span><FileCode2 size={14} aria-hidden="true" />{sample.label}</span><div>
        {download && <a href={download} download={sample.label} aria-label={`Download ${sample.label}`} title="Download example"><Download size={14} /></a>}
        <button type="button" onClick={copy} aria-label={`Copy ${sample.label}`} title={copied ? 'Copied' : 'Copy code'}>{copied ? <Check size={14} /> : <Copy size={14} />}</button>
      </div></div>
      <Highlight theme={codeTheme} code={sample.code.trim()} language={sample.language}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre style={style} tabIndex={0} aria-label={`${sample.label} code`}><code>
            {tokens.map((line, index) => <div key={index} {...getLineProps({ line })}>
              <span className="docs-line-number" aria-hidden="true">{index + 1}</span>
              <span>{line.map((token, tokenIndex) => <span key={tokenIndex} {...getTokenProps({ token })} />)}</span>
            </div>)}
          </code></pre>
        )}
      </Highlight>
      <span className="sr-only" role="status">{copied ? 'Code copied to clipboard.' : ''}</span>
      {error && <p className="docs-copy-error" role="alert">{error}</p>}
    </div>
  )
}

function CodeGroup({ samples }: { samples: CodeSample[] }) {
  const [selected, setSelected] = useState(0)
  const id = useId()
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number
    if (event.key === 'ArrowRight') next = (index + 1) % samples.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + samples.length) % samples.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = samples.length - 1
    else return
    event.preventDefault()
    setSelected(next)
    document.getElementById(`${id}-tab-${next}`)?.focus()
  }
  return <div className="docs-code-group">
    <div role="tablist" aria-label="Code variants">{samples.map((sample, index) => <button type="button" role="tab" id={`${id}-tab-${index}`} key={sample.label}
      aria-controls={`${id}-panel`} aria-selected={selected === index} tabIndex={selected === index ? 0 : -1}
      onClick={() => setSelected(index)} onKeyDown={event => navigate(event, index)}>{sample.label}</button>)}</div>
    <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${selected}`}><CodeBlock key={selected} sample={samples[selected]} download={samples[selected].download} /></div>
  </div>
}

function Block({ block }: { block: DocBlock }) {
  switch (block.type) {
    case 'paragraph': return <p>{block.text}</p>
    case 'code': return <CodeBlock sample={block.sample} download={block.download} />
    case 'code-group': return <CodeGroup samples={block.samples} />
    case 'list': {
      const List = block.ordered ? 'ol' : 'ul'
      return <List className="docs-list">{block.items.map(item => <li key={item}>{item}</li>)}</List>
    }
    case 'callout': {
      const Icon = block.tone === 'warning' ? TriangleAlert : block.tone === 'tip' ? Sparkles : Info
      return <aside className={`docs-callout docs-callout-${block.tone}`}><Icon size={18} aria-hidden="true" /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>
    }
    case 'table': return <div className="docs-table-wrap" tabIndex={0} role="region" aria-label={block.headers.join(', ')}><table><thead><tr>{block.headers.map(header => <th scope="col" key={header}>{header}</th>)}</tr></thead><tbody>{block.rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>
    case 'links': return <div className="docs-cards">{block.items.map(item => <DocLink key={item.href} href={item.href} className="docs-card"><div><strong>{item.title}</strong><p>{item.description}</p></div>{item.href.startsWith('/') ? <ArrowRight size={17} aria-hidden="true" /> : <ArrowUpRight size={17} aria-hidden="true" />}</DocLink>)}</div>
  }
}

function SearchDialog({ track, onNavigate }: { track: DocTrack; onNavigate: () => void }) {
  const { searchIndex: docSearchIndex, label } = docTracks[track]
  const dialog = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLElement>(null)
  const [query, setQuery] = useState('')
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
  const results = words.length
    ? docSearchIndex.filter(item => words.every(word => item.text.includes(word)))
      .sort((a, b) => Number(b.section.toLowerCase().includes(query.toLowerCase())) - Number(a.section.toLowerCase().includes(query.toLowerCase()))).slice(0, 8)
    : docSearchIndex.filter(item => item.href.startsWith(docHref('installation', track)) || item.href.startsWith(docHref('first-gate', track))).slice(0, 6)

  function open() {
    setQuery('')
    dialog.current?.showModal()
    input.current?.focus()
  }

  useEffect(() => {
    function shortcut(event: globalThis.KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        if (dialog.current?.open) dialog.current.close()
        else {
          setQuery('')
          dialog.current?.showModal()
          input.current?.focus()
        }
      }
    }
    document.addEventListener('keydown', shortcut)
    return () => document.removeEventListener('keydown', shortcut)
  }, [])

  function navigateResults(event: KeyboardEvent<HTMLElement>) {
    const anchors = [...(resultsRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [])]
    const index = anchors.findIndex(anchor => anchor === document.activeElement)
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      anchors[Math.min(index + 1, anchors.length - 1)]?.focus()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (index <= 0) input.current?.focus()
      else anchors[index - 1]?.focus()
    }
  }

  return <>
    <button className="docs-search-trigger" type="button" onClick={open} aria-label="Search documentation"><Search size={15} aria-hidden="true" /><span>Search documentation…</span><kbd>Ctrl K</kbd></button>
    <dialog ref={dialog} className="docs-search-dialog" aria-labelledby="docs-search-title"
      onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); dialog.current?.close() } }}
      onClick={event => { if (event.target === dialog.current) dialog.current?.close() }}>
      <div className="docs-search-box"><Search size={20} aria-hidden="true" /><label id="docs-search-title" className="sr-only" htmlFor="docs-search-input">Search {label} documentation</label>
        <input ref={input} id="docs-search-input" type="search" value={query} onChange={event => setQuery(event.target.value)} onKeyDown={navigateResults} placeholder="Search guides, concepts, and code…" autoComplete="off" />
        <button type="button" aria-label="Close search" onClick={() => dialog.current?.close()}><X size={18} /></button>
      </div>
      <div className="docs-search-caption mono" role="status">{query.trim() ? `${results.length}${results.length === 8 ? '+' : ''} MATCHING SECTIONS` : 'START EXPLORING'}</div>
      <nav className="docs-search-results" aria-label="Search results" ref={resultsRef} onKeyDown={navigateResults}>
        {results.map(item => <Link key={item.href} to={item.href} onClick={() => { dialog.current?.close(); onNavigate() }}><span className="docs-search-result-icon"><Hash size={16} /></span><div><span>{item.title}</span><strong>{item.section}</strong></div><ArrowUpRight size={15} aria-hidden="true" /></Link>)}
        {!results.length && <div className="docs-search-empty"><BookOpen size={26} /><h3>No matching sections</h3><p>Try “Invariant”, “ledger”, “install”, or “LangGraph”.</p></div>}
      </nav>
      <div className="docs-search-footer"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span></div>
    </dialog>
  </>
}

const navigationLabels: Record<string, string> = {
  introduction: 'Introduction', installation: 'Installation', 'first-gate': 'Your first gate',
  thresholds: 'Rules & thresholds', ledger: 'Evidence & ledger', testing: 'Testing your gates',
  scanning: 'Governance scanning', integrations: 'Framework integrations', reference: 'API & troubleshooting',
}

function Sidebar({ track, current, close }: { track: DocTrack; current: string; close: () => void }) {
  const navigate = useNavigate()
  const docPages = docTracks[track].pages
  const docGroups = [...new Set(docPages.map(page => page.group))]
  return <nav className="docs-sidebar-nav" aria-label="Documentation navigation">
    <label className="docs-track-picker"><span className="mono">DOCUMENTATION LANGUAGE</span>
      <select aria-label="Documentation language" value={track} onChange={event => {
        const next = event.target.value
        if (next === 'python' || next === 'typescript') {
          const nextSlug = docTracks[next].pages.some(page => page.slug === current) ? current : 'introduction'
          navigate(docHref(nextSlug, next))
          close()
        }
      }}>
        <option value="python">Python</option><option value="typescript">TypeScript / JavaScript</option>
      </select>
    </label>
    {docGroups.map(group => <div className="docs-nav-group" key={group}><h2 className="mono">{group}</h2>{docPages.filter(page => page.group === group).map(page => (
      <Link to={docHref(page.slug, track)} key={page.slug} onClick={close} aria-current={current === page.slug ? 'page' : undefined}>
        <span>{navigationLabels[page.slug] ?? page.title}</span>
        {current === page.slug && <ChevronRight size={14} aria-hidden="true" />}
      </Link>
    ))}</div>)}
    <a className="docs-sidebar-github" href={links.github} target="_blank" rel="noreferrer"><Github size={15} />Explore the source<ArrowUpRight size={13} /></a>
  </nav>
}

function Article({ page, track }: { page: DocPage; track: DocTrack }) {
  const { pages: docPages, runtime, label } = docTracks[track]
  const index = docPages.findIndex(item => item.slug === page.slug)
  return <article className="docs-article">
    <div className="docs-breadcrumb"><Link to={docHref('introduction', track)}>Documentation</Link><ChevronRight size={12} /><span>{label}</span><ChevronRight size={12} /><span>{page.group}</span></div>
    <div className="docs-article-eyebrow mono"><span />{page.eyebrow}</div>
    <h1 id="docs-title" tabIndex={-1}>{page.title}</h1>
    <p className="docs-description">{page.description}</p>
    <div className="docs-article-meta"><span><Code2 size={13} />{runtime}</span><span><ShieldCheck size={13} />Source-backed guide</span><span className="mono">{String(index + 1).padStart(2, '0')} / {String(docPages.length).padStart(2, '0')}</span></div>
    {page.sections.map(section => <section id={section.id} key={section.id} className="docs-section" tabIndex={-1}>
      <h2><a href={`#${section.id}`}><span>{section.title}</span><Hash size={18} aria-hidden="true" /></a></h2>
      {section.blocks.map((block, blockIndex) => <Fragment key={blockIndex}><Block block={block} /></Fragment>)}
    </section>)}
    <section className="docs-sources" id="sources"><h2><Github size={17} />Based on the source</h2><p>Read the upstream documentation for full APIs, requirements, and release-specific behavior.</p><div>{page.sources.map(source => <a href={source.href} target="_blank" rel="noreferrer" key={source.href}>{source.title}<ArrowUpRight size={13} /></a>)}</div></section>
    <nav className="docs-pagination" aria-label="Guide pagination">
      {index > 0 ? <Link to={docHref(docPages[index - 1].slug, track)}><span className="mono"><ArrowLeft size={12} />PREVIOUS</span><strong>{docPages[index - 1].slug === 'introduction' ? 'Introduction' : docPages[index - 1].title}</strong></Link> : <div />}
      {index < docPages.length - 1 ? <Link to={docHref(docPages[index + 1].slug, track)}><span className="mono">UP NEXT<ArrowRight size={12} /></span><strong>{docPages[index + 1].title}</strong></Link> : <Link to={docHref('introduction', track)}><span className="mono">BACK TO THE START<ArrowRight size={12} /></span><strong>Explore the learning path</strong></Link>}
    </nav>
    <div className="docs-article-footer"><span>Super Semantics · {label} documentation</span><a href={links.email}>Something unclear? Get in touch <ArrowUpRight size={12} /></a></div>
  </article>
}

export default function Documentation({ track = 'python' }: { track?: DocTrack }) {
  const { pages: docPages, label, badge } = docTracks[track]
  const { slug = 'introduction' } = useParams()
  const location = useLocation()
  const page = docPages.find(item => item.slug === slug)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const mobileToggle = useRef<HTMLButtonElement>(null)
  const mobilePanel = useRef<HTMLElement>(null)
  const previousPath = useRef<string | null>(null)

  useEffect(() => {
    const oldTitle = document.title
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const oldDescription = description?.content
    document.title = `${page?.title ?? 'Page not found'} | ${label} docs · Super Semantics`
    if (description && page) description.content = page.description
    return () => {
      document.title = oldTitle
      if (description && oldDescription !== undefined) description.content = oldDescription
    }
  }, [page, label])

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (location.hash) {
        const target = document.getElementById(location.hash.slice(1))
        target?.scrollIntoView({ behavior: 'instant', block: 'start' })
        target?.focus({ preventScroll: true })
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' })
        if (previousPath.current !== null) document.getElementById('docs-title')?.focus({ preventScroll: true })
      }
      previousPath.current = location.pathname
    })
    return () => cancelAnimationFrame(frame)
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!page) return
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]) setActiveSection(visible[0].target.id)
    }, { rootMargin: '-90px 0px -65% 0px' })
    page.sections.forEach(section => {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [page])

  useEffect(() => {
    if (!mobileOpen) return
    mobilePanel.current?.querySelector<HTMLAnchorElement>('[aria-current="page"]')?.focus()
    function escape(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        setMobileOpen(false)
        mobileToggle.current?.focus()
      }
    }
    const desktop = matchMedia('(min-width: 901px)')
    const closeOnDesktop = () => { if (desktop.matches) setMobileOpen(false) }
    document.addEventListener('keydown', escape)
    desktop.addEventListener('change', closeOnDesktop)
    return () => {
      document.removeEventListener('keydown', escape)
      desktop.removeEventListener('change', closeOnDesktop)
    }
  }, [mobileOpen])

  return <div className="docs-app">
    <a className="skip-link" href="#docs-main">Skip to documentation</a>
    <header className="docs-header"><div className="docs-header-inner"><Brand href="/" /><Link className="docs-header-label mono" to={docHref('introduction', track)} onClick={() => setMobileOpen(false)}>DOCS<span>{badge}</span></Link><SearchDialog key={track} track={track} onNavigate={() => setMobileOpen(false)} /><a className="docs-header-github" href={links.github} target="_blank" rel="noreferrer"><Github size={16} /><span>GitHub</span><ArrowUpRight size={13} /></a><Link className="docs-website-link" to="/">Website<ArrowUpRight size={13} /></Link></div></header>
    <div className="docs-mobile-bar"><button type="button" ref={mobileToggle} onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen} aria-controls="docs-mobile-navigation">{mobileOpen ? <X size={17} /> : <Menu size={17} />}Browse documentation</button><span className="mono">{badge}</span></div>
    <aside ref={mobilePanel} id="docs-mobile-navigation" className="docs-mobile-navigation" hidden={!mobileOpen}><Sidebar track={track} current={slug} close={() => setMobileOpen(false)} /></aside>
    <div className="docs-layout" inert={mobileOpen}>
      <aside className="docs-sidebar"><Sidebar track={track} current={slug} close={() => setMobileOpen(false)} /><div className="docs-sidebar-note"><ShieldCheck size={19} /><strong>Before the action.<br />Not after the damage.</strong><p>Computable governance for autonomous systems.</p></div></aside>
      <main className="docs-main" id="docs-main" tabIndex={-1}>
        {page ? <Article key={`${track}-${page.slug}`} page={page} track={track} /> : <div className="docs-not-found"><span className="mono">404 / GUIDE NOT FOUND</span><h1 id="docs-title" tabIndex={-1}>That guide isn’t here.</h1><p>Choose a guide from the sidebar or search the {label} documentation.</p><Link to={docHref('introduction', track)}>Back to introduction <ArrowRight size={16} /></Link></div>}
      </main>
      <aside className="docs-toc"><div><span className="mono">ON THIS PAGE</span><nav aria-label="On this page">{page?.sections.map(section => <a key={section.id} href={`#${section.id}`} aria-current={activeSection === section.id ? 'location' : undefined}>{section.title}</a>)}</nav>{page && <a className="docs-source-link" href={page.sources[0].href} target="_blank" rel="noreferrer"><Github size={14} />View source<ArrowUpRight size={12} /></a>}<div className="docs-toc-note"><BookOpen size={18} /><p>One boundary at a time.</p><span>Learn the primitives.<br />Prove the behavior.</span></div></div></aside>
    </div>
  </div>
}
