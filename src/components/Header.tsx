import { useEffect, useRef, useState } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { Logo } from './Logo'
import type { ContactHandler } from '../config/experience'

const nav = [
  ['soluciones', 'Soluciones'],
  ['producto', 'Demo'],
  ['ingenieria', 'Ingeniería'],
  ['metodologia', 'Cómo trabajamos'],
] as const
export function Header({ onContact }: { onContact: ContactHandler }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('inicio')
  const menuButton = useRef<HTMLButtonElement>(null)
  const header = useRef<HTMLElement>(null)
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1000px)')
    const resize = () => {
      if (media.matches) setOpen(false)
    }
    media.addEventListener('change', resize)
    const visible = new Set<Element>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target)
          else visible.delete(entry.target)
        }
        const nearest = [...visible].sort(
          (a, b) =>
            Math.abs(a.getBoundingClientRect().top - 80) -
            Math.abs(b.getBoundingClientRect().top - 80),
        )[0]
        if (nearest) setActive(nearest.id)
      },
      { rootMargin: '-80px 0px -65% 0px' },
    )
    document
      .querySelectorAll('main > section[id]')
      .forEach((section) => observer.observe(section))
    return () => {
      media.removeEventListener('change', resize)
      observer.disconnect()
    }
  }, [])
  return (
    <header
      ref={header}
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          setOpen(false)
          menuButton.current?.focus()
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node))
          setOpen(false)
      }}
    >
      <div className="shell site-header__inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Navegación principal">
          {nav.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? 'location' : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <button
          className="button button--dark desktop-cta"
          onClick={() => onContact()}
        >
          Hablemos <ArrowUpRight size={16} />
        </button>
        <button
          ref={menuButton}
          className="icon-button menu-button"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <nav
        id="mobile-navigation"
        className="mobile-menu"
        aria-label="Navegación móvil"
        hidden={!open}
      >
        {nav.map(([id, label]) => (
          <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
        <button
          className="button button--dark"
          onClick={() => {
            setOpen(false)
            onContact()
          }}
        >
          Hablemos <ArrowUpRight size={16} />
        </button>
      </nav>
    </header>
  )
}
