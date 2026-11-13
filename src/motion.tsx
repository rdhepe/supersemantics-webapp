import { Fragment, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'
import Lenis from 'lenis'
import { MotionConfig, motion, useScroll, useSpring, useTransform } from 'motion/react'
import { Pause, Play } from 'lucide-react'
import { MotionContext, usePageMotion } from './motion-preference'

const ease = [0.22, 1, 0.36, 1] as const
const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

function subscribeReducedMotion(notify: () => void) {
  const query = matchMedia(reducedMotionQuery)
  query.addEventListener('change', notify)
  return () => query.removeEventListener('change', notify)
}

function getReducedMotion() {
  return matchMedia(reducedMotionQuery).matches
}

export function PageMotion({ children }: { children: ReactNode }) {
  const systemReduced = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => true)
  const [paused, setPaused] = useState(false)
  const reduced = systemReduced || paused

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? 'reduced' : 'full'
    return () => { delete document.documentElement.dataset.motion }
  }, [reduced])

  return (
    <MotionContext value={{ reduced, systemReduced, toggle: () => setPaused(value => !value) }}>
      <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>{children}</MotionConfig>
    </MotionContext>
  )
}

export function ScrollExperience() {
  const { reduced } = usePageMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 32, restDelta: 0.001 })

  useEffect(() => {
    if (reduced) return
    const pointer = matchMedia('(hover: hover) and (pointer: fine)')
    let lenis: Lenis | undefined
    let anchorFrame = 0

    const configure = () => {
      lenis?.destroy()
      lenis = pointer.matches ? new Lenis({
        autoRaf: true,
        lerp: 0.09,
        smoothWheel: true,
        syncTouch: false,
        prevent: node => node.id === 'mobile-menu',
      }) : undefined
    }

    const navigate = (event: MouseEvent) => {
      if (!lenis || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null
      if (!link || link.target || link.hasAttribute('download') || link.classList.contains('skip-link')) return
      const target = document.getElementById(link.hash.slice(1))
      if (!target) return
      event.preventDefault()
      if (location.hash !== link.hash) history.pushState(null, '', link.hash)
      cancelAnimationFrame(anchorFrame)
      anchorFrame = requestAnimationFrame(() => {
        lenis?.resize()
        lenis?.scrollTo(target, {
          duration: 1.15,
          lerp: 0,
          easing: value => 1 - Math.pow(1 - value, 4),
          onComplete: () => target.focus({ preventScroll: true }),
        })
      })
    }

    configure()
    pointer.addEventListener('change', configure)
    document.addEventListener('click', navigate)
    return () => {
      pointer.removeEventListener('change', configure)
      document.removeEventListener('click', navigate)
      cancelAnimationFrame(anchorFrame)
      lenis?.destroy()
    }
  }, [reduced])

  return <motion.div className="scroll-progress" aria-hidden="true" style={{ scaleX: reduced ? scrollYProgress : progress }} />
}

export function MotionToggle() {
  const { reduced, systemReduced, toggle } = usePageMotion()
  return (
    <button className="motion-toggle" type="button" onClick={toggle} disabled={systemReduced}
      aria-pressed={reduced} aria-label={systemReduced ? 'Reduced motion enabled by your device' : reduced ? 'Resume animations' : 'Pause animations'}>
      {reduced ? <Play size={11} aria-hidden="true" /> : <Pause size={11} aria-hidden="true" />}
      {systemReduced ? 'REDUCED MOTION' : reduced ? 'RESUME MOTION' : 'PAUSE MOTION'}
    </button>
  )
}

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { reduced } = usePageMotion()
  return (
    <motion.div className={className} initial={false}
      whileInView={reduced ? undefined : { y: [32, 0], opacity: [0.3, 1] }}
      viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.85, delay: reduced ? 0 : delay, ease }}>
      {children}
    </motion.div>
  )
}

export function TextReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  const { reduced } = usePageMotion()
  const words = text.split(' ')
  return (
    <span className="text-reveal">
      <motion.span initial={reduced ? false : 'hidden'} whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{ visible: { transition: { staggerChildren: reduced ? 0 : 0.055, delayChildren: reduced ? 0 : delay } } }}>
        {words.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <span className="word-clip">
              <motion.span variants={{ hidden: { y: reduced ? 0 : '110%', rotate: reduced ? 0 : 3 }, visible: { y: 0, rotate: 0 } }}
                transition={{ duration: reduced ? 0 : 0.85, ease }}>{word}</motion.span>
            </span>
            {index < words.length - 1 && ' '}
          </Fragment>
        ))}
      </motion.span>
    </span>
  )
}

export function Parallax({ children, className = '', distance = 25 }: { children: ReactNode; className?: string; distance?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { reduced } = usePageMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance])
  return <motion.div ref={ref} className={`parallax-layer ${className}`} style={{ y: reduced ? 0 : y }}>{children}</motion.div>
}
