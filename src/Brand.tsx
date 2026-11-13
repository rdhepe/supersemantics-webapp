import { Link } from 'react-router-dom'

export default function Brand({ footer = false, href = '#top' }: { footer?: boolean; href?: string }) {
  const className = `brand${footer ? ' brand-footer' : ''}`
  const content = <>
    <img src="/brand-mark.png" width="36" height="36" alt="" />
    <span>Super<span className="brand-light">Semantics</span><span className="brand-period">.</span></span>
  </>
  return href.startsWith('/')
    ? <Link className={className} to={href} aria-label="Super Semantics home">{content}</Link>
    : <a className={className} href={href} aria-label="Super Semantics home">{content}</a>
}
