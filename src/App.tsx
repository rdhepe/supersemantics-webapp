import { useEffect, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent, ReactNode } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { Link } from 'react-router-dom'
import {
  ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, Check, CheckCheck,
  ChevronRight, Code2, Fingerprint, GitBranch, Mail, Menu, Plus,
  ScanLine, ShieldCheck, X,
} from 'lucide-react'
import { links, navigation, research, stages, useCases } from './content'
import { MotionToggle, PageMotion, Parallax, Reveal, ScrollExperience, TextReveal } from './motion'
import { usePageMotion } from './motion-preference'
import Brand from './Brand'

const copyrightYear = new Date().getFullYear()

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return diagonal ? <ArrowUpRight size={17} aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />
}

function Header() {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector<HTMLAnchorElement>('a')?.focus()
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const desktop = matchMedia('(min-width: 901px)')
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false) }
    document.addEventListener('keydown', closeOnEscape)
    desktop.addEventListener('change', closeOnDesktop)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      desktop.removeEventListener('change', closeOnDesktop)
    }
  }, [open])

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}
          <Link to="/docs" className="documentation-link">Docs <BookOpen size={13} aria-hidden="true" /></Link>
        </nav>
        <a className="button button-lime header-cta" href={links.scan}>Scan your code <Arrow diagonal /></a>
        <button ref={toggleRef} className="menu-toggle" type="button" aria-expanded={open}
          aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>
        <nav ref={panelRef} id="mobile-menu" className="mobile-nav container" aria-label="Mobile navigation" hidden={!open}>
          {navigation.map((item, index) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              <span className="mono" aria-hidden="true">0{index + 1}</span>{item.label}<Arrow diagonal />
            </a>
          ))}
          <Link to="/docs" onClick={() => setOpen(false)}>Documentation <BookOpen size={17} aria-hidden="true" /></Link>
          <a href={links.scan} onClick={() => setOpen(false)}>Scan your code<Arrow diagonal /></a>
        </nav>
    </header>
  )
}

function SectionLabel({ number, children, light = false }: { number: string; children: ReactNode; light?: boolean }) {
  return <div className={`section-label mono${light ? ' label-light' : ''}`}><span aria-hidden="true">[ {number} ]</span>{children}</div>
}

function GovernanceVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { margin: '80px' })
  return (
    <div ref={ref} className={`governance-visual${visible ? ' is-visible' : ''}`} role="img"
      aria-label="Illustrative governance flow: an agent request passes through X-VERBA policy evaluation, receives a permit verdict, and becomes linked evidence.">
      <div className="visual-topline mono"><span><span className="status-dot" /> X-VERBA / SYSTEM MODEL</span><span>FIG. 001</span></div>
      <div className="visual-grid" />
      <div className="visual-scan" aria-hidden="true" />
      <svg className="governance-svg" viewBox="0 0 540 430" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="gate-fill" x1="140" y1="100" x2="420" y2="350" gradientUnits="userSpaceOnUse">
            <stop stopColor="#d0fa82" stopOpacity=".14" /><stop offset="1" stopColor="#d0fa82" stopOpacity=".02" />
          </linearGradient>
          <linearGradient id="route-fill" x1="50" y1="220" x2="490" y2="220" gradientUnits="userSpaceOnUse">
            <stop stopColor="#c8f589" stopOpacity=".1" /><stop offset=".5" stopColor="#d0fa82" /><stop offset="1" stopColor="#c8f589" stopOpacity=".2" />
          </linearGradient>
        </defs>
        <ellipse className="orbit orbit-one" cx="270" cy="220" rx="208" ry="94" transform="rotate(-28 270 220)" stroke="#d0fa82" strokeOpacity=".17" strokeDasharray="3 7" />
        <ellipse className="orbit orbit-two" cx="270" cy="220" rx="186" ry="128" transform="rotate(32 270 220)" stroke="#d0fa82" strokeOpacity=".12" />
        <path className="signal-route" d="M56 178H135L198 220H340L405 270H493" stroke="url(#route-fill)" strokeWidth="1.5" />
        <path d="M110 315L198 263M340 177L434 120" stroke="#d0fa82" strokeOpacity=".25" strokeDasharray="4 5" />
        <g className="gate-shadow" stroke="#c6ef95">
          <path d="M270 114L376 175V283L270 344L164 283V175L270 114Z" strokeOpacity=".08" />
          <path d="M270 104L376 165V273L270 334L164 273V165L270 104Z" strokeOpacity=".15" />
        </g>
        <g className="gate-core">
          <path d="M270 89L376 150V258L270 319L164 258V150L270 89Z" fill="#171d13" stroke="#d0fa82" strokeOpacity=".5" />
          <path d="M270 89L376 150L270 212L164 150L270 89Z" fill="url(#gate-fill)" stroke="#d0fa82" strokeOpacity=".45" />
          <path d="M270 212V319M164 150L270 212L376 150" stroke="#d0fa82" strokeOpacity=".35" />
          <path d="M270 121L321 150L270 180L219 150L270 121Z" stroke="#d0fa82" strokeWidth="1.5" />
          <path d="M247 150L263 160L292 141" stroke="#d0fa82" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M188 186L244 218V270L188 238V186Z" stroke="#d0fa82" strokeOpacity=".25" />
          <path d="M199 205L233 225M199 217L223 231M199 229L228 246" stroke="#d0fa82" strokeOpacity=".55" />
          <path d="M293 229L351 195M293 241L351 207M293 253L330 231" stroke="#d0fa82" strokeOpacity=".35" />
          <circle cx="344" cy="242" r="3" fill="#d0fa82" />
        </g>
        <circle className="route-packet packet-one" cx="112" cy="178" r="4" fill="#d0fa82" />
        <circle className="route-packet packet-two" cx="440" cy="270" r="4" fill="#d0fa82" />
        <circle cx="110" cy="315" r="3" fill="#80996b" />
        <circle cx="434" cy="120" r="3" fill="#80996b" />
      </svg>
      <div className="diagram-card request-card">
        <span className="diagram-card-icon"><Code2 size={15} /></span>
        <div><span className="mono diagram-micro">01 / INPUT</span><strong>Agent request</strong></div>
        <span className="request-cursor" />
      </div>
      <div className="diagram-card verdict-card">
        <span className="verdict-icon"><Check size={16} /></span>
        <div><span className="mono diagram-micro">02 / POLICY VERDICT</span><strong>Permitted action</strong></div>
      </div>
      <div className="evidence-label mono"><GitBranch size={13} /><span>03 / EVIDENCE LINKED</span></div>
      <div className="visual-bottomline mono"><span>SPECIFY. GOVERN. VERIFY.</span><span className="visual-demo">ILLUSTRATIVE FLOW <Plus size={12} /></span></div>
    </div>
  )
}

function Hero() {
  const { reduced } = usePageMotion()
  return (
    <section className="hero-section" aria-labelledby="hero-heading">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-copy">
            <motion.div className="eyebrow mono" initial={false}
              animate={reduced ? undefined : { opacity: [0, 1], y: [8, 0] }} transition={{ duration: 0.6 }}>
              <span className="status-dot" /> GOVERNANCE FOR AUTONOMOUS FUTURES
            </motion.div>
            <h1 id="hero-heading">
              <TextReveal text="Proof your agents did what they were" delay={0.1} />{' '}<em><TextReveal text="allowed to do." delay={0.45} /></em>
            </h1>
            <Reveal delay={0.25}><p className="hero-description">Autonomy needs more than intelligence.<br className="desktop-break" /> It needs rules, boundaries, and proof.</p></Reveal>
            <Reveal className="hero-actions" delay={0.35}>
              <a className="button button-lime" href={links.scan}>Scan your code <Arrow diagonal /></a>
              <a className="text-link" href="#how-it-works">See how it works <ArrowDown size={16} aria-hidden="true" /></a>
            </Reveal>
          </div>
          <Parallax className="hero-art" distance={32}><motion.div initial={false} animate={reduced ? undefined : { opacity: [0, 1], y: [16, 0] }}
            transition={{ duration: 1, delay: 0.15 }}>
            <GovernanceVisual />
            <div className="art-caption mono"><span>A BOUNDARY BEFORE CONSEQUENCE.</span><span>POWERED BY X-VERBA</span></div>
          </motion.div></Parallax>
        </div>
        <div className="hero-bottom">
          <span className="mono hero-bottom-label">AUTONOMY, WITH ACCOUNTABILITY.</span>
          <div className="hero-capabilities">
            <span><ScanLine size={14} /> Executable specifications</span>
            <span><ShieldCheck size={14} /> Runtime governance</span>
            <span><Fingerprint size={14} /> Verifiable evidence</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function MotionMarquee() {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref)
  return (
    <div ref={ref} className={`motion-marquee${visible ? ' is-visible' : ''}`} aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map(group => <div className="marquee-group mono" key={group}>
          <span>DEFINE THE RULES.</span><Plus size={14} /><span>GOVERN THE ACTION.</span><Plus size={14} /><span>PRESERVE THE PROOF.</span><Plus size={14} />
        </div>)}
      </div>
    </div>
  )
}

function Manifesto() {
  return (
    <section className="manifesto light-section" aria-labelledby="manifesto-heading">
      <div className="container">
        <SectionLabel number="01">THE GOVERNANCE GAP</SectionLabel>
        <Reveal className="manifesto-grid">
          <h2 id="manifesto-heading"><TextReveal text="Intelligence is not" /><br /><span className="muted-ink"><TextReveal text="its own authority." delay={0.15} /></span></h2>
          <div className="manifesto-aside">
            <ArrowDownRight className="manifesto-arrow" size={40} strokeWidth={1} aria-hidden="true" />
            <p>AI systems are moving from making suggestions to taking action. The question is no longer just what they <em>can</em> do. It’s what they’re <em>allowed</em> to do.</p>
            <p className="manifesto-principle">Computable, not claimed.<br />Verifiable, not assumed.</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number, count: number, select: (next: number) => void, prefix: string, vertical = false) {
  const previous = vertical ? 'ArrowUp' : 'ArrowLeft'
  const next = vertical ? 'ArrowDown' : 'ArrowRight'
  let target: number
  if (event.key === next) target = (index + 1) % count
  else if (event.key === previous) target = (index - 1 + count) % count
  else if (event.key === 'Home') target = 0
  else if (event.key === 'End') target = count - 1
  else return
  event.preventDefault()
  select(target)
  document.getElementById(`${prefix}-tab-${target}`)?.focus()
}

function Lifecycle() {
  const [selected, setSelected] = useState(0)
  const stage = stages[selected]
  const { reduced } = usePageMotion()
  return (
    <section className="lifecycle section-space" id="how-it-works" tabIndex={-1} aria-labelledby="lifecycle-heading">
      <div className="container">
        <div className="section-heading">
          <div><SectionLabel number="02" light>THE X-VERBA LIFECYCLE</SectionLabel><h2 id="lifecycle-heading"><TextReveal text="From intention." /><br /><span className="muted"><TextReveal text="To evidence." delay={0.15} /></span></h2></div>
          <p>One governance lifecycle.<br />Before, during, and after the action.</p>
        </div>
        <div className="lifecycle-tabs" role="tablist" aria-label="Governance lifecycle">
          {stages.map((item, index) => (
            <button key={item.name} id={`stage-tab-${index}`} role="tab" type="button"
              aria-selected={selected === index} aria-controls="stage-panel" tabIndex={selected === index ? 0 : -1}
              onClick={() => setSelected(index)} onKeyDown={event => handleTabKey(event, index, stages.length, setSelected, 'stage')}>
              <span className="mono tab-number">0{index + 1}</span><span>{item.name}</span><ArrowUpRight size={20} aria-hidden="true" />
              {selected === index && <motion.span className="stage-active-line" layoutId="stage-active-line" transition={{ type: 'spring', stiffness: 300, damping: 32, duration: reduced ? 0 : undefined }} />}
            </button>
          ))}
        </div>
        <div role="tabpanel" id="stage-panel" aria-labelledby={`stage-tab-${selected}`} tabIndex={0} className="lifecycle-panel">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div className="lifecycle-content" key={selected} initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -8 }} transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}>
              <div className="stage-copy">
                <span className="mono lime-text stage-label">{stage.label}</span>
                <h3>{stage.title}</h3>
                <p>{stage.description}</p>
                <ul className="feature-list">{stage.features.map(feature => <li key={feature}><Check size={14} aria-hidden="true" />{feature}</li>)}</ul>
                <a className="text-link" href="#contact">Let’s build with boundaries <Arrow /></a>
              </div>
              <div className="specification">
                <div className="spec-header"><div className="window-dots"><i /><i /><i /></div><span className="mono">{stage.file}</span><span className="mono spec-example">ILLUSTRATIVE</span></div>
                <div className="spec-code" aria-label={`${stage.label} illustrative pseudocode`}>
                  <div className="code-comment mono">// {stage.label.toLowerCase()}</div>
                  {stage.code.map(([key, value], index) => (
                    <motion.div className="code-line mono" key={key} initial={reduced ? false : { opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }} transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : index * 0.065 }}>
                      <span className="line-number" aria-hidden="true">0{index + 1}</span><span className="code-key">{key}</span><span className="code-colon">:</span><span className="code-value">{value}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="spec-status mono"><span><CheckCheck size={15} />{stage.status}</span><span>VSL / X-VERBA</span></div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="lifecycle-footnote"><span className="mono">THE PRINCIPLE</span><p>{stage.principle}</p><Plus size={18} aria-hidden="true" /></div>
      </div>
    </section>
  )
}

function UseCases() {
  const [selected, setSelected] = useState(0)
  const current = useCases[selected]
  const { reduced } = usePageMotion()
  return (
    <section className="use-cases light-section section-space" id="use-cases" tabIndex={-1} aria-labelledby="use-cases-heading">
      <div className="container">
        <div className="section-heading">
          <div><SectionLabel number="03">WHERE IT MATTERS</SectionLabel><h2 id="use-cases-heading"><TextReveal text="Different systems." /><br /><span className="muted-ink"><TextReveal text="Same boundary." delay={0.15} /></span></h2></div>
          <p>Where an AI decision becomes a real-world consequence, governance belongs in the execution path.</p>
        </div>
        <div className="use-cases-grid">
          <div className="use-case-tabs" role="tablist" aria-label="Use cases" aria-orientation="vertical">
            {useCases.map((item, index) => (
              <button type="button" role="tab" id={`case-tab-${index}`} key={item.name}
                aria-selected={selected === index} aria-controls="case-panel" tabIndex={selected === index ? 0 : -1}
                onClick={() => setSelected(index)} onKeyDown={event => handleTabKey(event, index, useCases.length, setSelected, 'case', true)}>
                <span className="mono" aria-hidden="true">0{index + 1}</span><span>{item.name}</span><ChevronRight size={17} aria-hidden="true" />
                {selected === index && <motion.span className="case-active-background" layoutId="case-active-background" transition={{ duration: reduced ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }} />}
              </button>
            ))}
          </div>
          <div role="tabpanel" tabIndex={0} id="case-panel" aria-labelledby={`case-tab-${selected}`} className="use-case-panel">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={selected} initial={reduced ? false : { opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: reduced ? 0 : -10 }} transition={{ duration: reduced ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}>
                <span className="mono case-category">{current.fullName}</span>
                <h3>{current.short}</h3>
                <div className="case-flow" aria-label="Illustrative governance workflow">{current.flow.map((step, index) => <div key={step}><span className={`flow-dot${index === 2 ? ' flow-gate' : ''}`}>{index === 2 ? <ShieldCheck size={16} /> : <span />}</span><span>{step}</span>{index < 3 && <div className="flow-connector" />}</div>)}</div>
                <div className="case-description"><div><h4 className="mono">THE CHALLENGE</h4><p>{current.challenge}</p></div><div><h4 className="mono">HOW X-VERBA APPLIES</h4><p>{current.application}</p></div></div>
                <div className="case-tags">{current.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="architecture-strip"><span className="mono">THE FOUNDATION</span><p>VSL-Core <ArrowRight /> VSL-Agentic adapters <ArrowRight /> Agent runtime <ArrowRight /> X-VERBA Policy Engine <ArrowRight /> Verba Ledger</p></div>
      </div>
    </section>
  )
}

function Research() {
  return (
    <section className="research section-space" id="research" tabIndex={-1} aria-labelledby="research-heading">
      <div className="container research-grid">
        <div className="research-intro">
          <SectionLabel number="04" light>GROUNDED IN RESEARCH</SectionLabel>
          <h2 id="research-heading"><TextReveal text="Built on questions." /><br /><span className="muted"><TextReveal text="Not assumptions." delay={0.15} /></span></h2>
          <p>An open research programme exploring how autonomous systems can be specified, constrained, observed, and verified as they operate.</p>
          <a className="button button-outline" href={links.research} target="_blank" rel="noreferrer">Explore the research <Arrow diagonal /></a>
          <div className="research-symbol" aria-hidden="true"><div /><div /><div /><span>∴</span></div>
        </div>
        <div className="research-list">
          {research.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.04}>
              <a className="research-item" href={links.research} target="_blank" rel="noreferrer">
                <span className="mono research-number">0{index + 1}</span><div><h3>{item.title}</h3><p>{item.description}</p></div><Arrow diagonal />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="about light-section section-space" id="about" tabIndex={-1} aria-labelledby="about-heading">
      <div className="container about-grid">
        <SectionLabel number="05">INDEPENDENT BY DESIGN</SectionLabel>
        <div>
          <h2 id="about-heading"><TextReveal text="A small team." /><br /><TextReveal text="A consequential mission." delay={0.15} /></h2>
          <div className="about-body"><p>We’re an independent team building computable governance for autonomous systems. Our work brings together executable specification, constraint-driven systems, runtime governance, and verifiable evidence.</p><p>With a growing global presence, we work with organisations deploying autonomous systems in regulated and high-stakes environments.</p></div>
          <div className="locations"><span className="mono">CONNECTED ACROSS</span><div><span><span className="location-dot" />Auckland</span><span><span className="location-dot" />Mumbai</span><span><span className="location-dot" />Dubai</span></div></div>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section className="contact" id="contact" tabIndex={-1} aria-labelledby="contact-heading">
      <div className="contact-orbits" aria-hidden="true"><span /><span /><span /></div>
      <div className="container">
        <div className="contact-top mono"><span><span className="status-dot" /> LET’S BUILD WHAT COMES NEXT.</span><span>WITH BOUNDARIES BUILT IN.</span></div>
        <div className="contact-main"><h2 id="contact-heading"><TextReveal text="Your next agent." /><br /><span><TextReveal text="Accounted for." delay={0.15} /></span></h2><a className="contact-arrow" href={links.email} aria-label="Email Super Semantics"><ArrowUpRight strokeWidth={1} /></a></div>
        <div className="contact-bottom"><p>Building an autonomous system?<br />Let’s talk about what it should be allowed to do.</p><a href={links.email}>hello@supersemantics.org <Arrow diagonal /></a></div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top"><Brand footer /><p>Governance for<br />autonomous futures.</p><nav aria-label="Footer navigation">{navigation.map(item => <a href={item.href} key={item.href}>{item.label}</a>)}<a href="#contact">Contact</a><Link to="/docs">Documentation</Link></nav><div className="footer-external"><a href={links.github} target="_blank" rel="noreferrer">GitHub <Arrow diagonal /></a><a href={links.scan}>Scan your code <Arrow diagonal /></a></div></div>
        <div className="footer-bottom mono"><span>© {copyrightYear} SUPER SEMANTICS LIMITED</span><MotionToggle /><a href="#top">BACK TO TOP <ArrowUpRight size={13} /></a></div>
      </div>
    </footer>
  )
}

function ContactForm() {
  const dialog = useRef<HTMLDialogElement>(null)
  const launcher = useRef<HTMLButtonElement>(null)
  const [draftOpened, setDraftOpened] = useState(false)

  function openEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const requiredFields = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[required]')
    for (const field of requiredFields) {
      field.setCustomValidity(field.value.trim() ? '' : 'Please fill out this field.')
    }
    if (!form.reportValidity()) return

    const details = new FormData(form)
    const name = String(details.get('name')).trim()
    const email = String(details.get('email')).trim()
    const company = String(details.get('company')).trim()
    const message = String(details.get('message')).trim()
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      ...(company ? [`Company: ${company}`] : []),
      '',
      message,
    ].join('\r\n')
    window.location.href = `${links.email}?subject=${encodeURIComponent('Website enquiry')}&body=${encodeURIComponent(body)}`
    setDraftOpened(true)
  }

  return (
    <>
      <button ref={launcher} className="contact-launcher" type="button" aria-haspopup="dialog" aria-controls="contact-dialog"
        onClick={() => {
          setDraftOpened(false)
          dialog.current?.showModal()
          dialog.current?.querySelector<HTMLInputElement>('input')?.focus()
        }}>
        <Mail size={20} aria-hidden="true" /><span>Contact us</span>
      </button>
      <dialog ref={dialog} id="contact-dialog" className="contact-dialog" aria-labelledby="contact-form-heading"
        aria-describedby="contact-form-description" data-lenis-prevent=""
        onClose={() => launcher.current?.focus()}
        onKeyDown={event => {
          if (event.key === 'Escape') { event.preventDefault(); dialog.current?.close() }
        }}>
        <div className="contact-dialog-header">
          <div><span className="mono">LET’S TALK</span><h2 id="contact-form-heading">Contact us</h2></div>
          <button className="contact-close" type="button" aria-label="Close contact form" onClick={() => dialog.current?.close()}>
            <X size={22} aria-hidden="true" />
          </button>
        </div>
        <p id="contact-form-description">Tell us what you’re building. We’ll prepare an email to hello@supersemantics.org in your email app.</p>
        <form className="contact-form" onSubmit={openEmail} onInput={event => {
          const field = event.target
          if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) field.setCustomValidity('')
        }}>
          <label htmlFor="contact-name">Name <span>(required)</span>
            <input id="contact-name" name="name" autoComplete="name" required maxLength={100} />
          </label>
          <label htmlFor="contact-email">Email address <span>(required)</span>
            <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} />
          </label>
          <label htmlFor="contact-company">Company <span>(optional)</span>
            <input id="contact-company" name="company" autoComplete="organization" maxLength={120} />
          </label>
          <label htmlFor="contact-message">Message <span>(required)</span>
            <textarea id="contact-message" name="message" rows={4} required maxLength={1500} />
          </label>
          <p className="contact-form-note">Nothing is sent or stored by this website. An email app must be configured; review the draft and press Send there.</p>
          <button className="button button-lime" type="submit">Open email draft <Mail size={17} aria-hidden="true" /></button>
          <p role="status" className="contact-form-status">{draftOpened && <>Email app requested. Your message has not been sent. If no draft opened, email <a href={links.email}>hello@supersemantics.org</a> directly. Your details remain here so you can copy them.</>}</p>
        </form>
      </dialog>
    </>
  )
}

function App() {
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (window.location.hash) document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' })
      else window.scrollTo({ top: 0, behavior: 'instant' })
    })
    return () => cancelAnimationFrame(frame)
  }, [])
  return (
    <PageMotion>
      <ScrollExperience />
      <a className="skip-link" href="#main">Skip to content</a>
      <div id="top" tabIndex={-1}><Header /><main id="main" tabIndex={-1}><Hero /><MotionMarquee /><Manifesto /><Lifecycle /><UseCases /><Research /><About /><Contact /></main><Footer /><ContactForm /></div>
    </PageMotion>
  )
}

export default App
