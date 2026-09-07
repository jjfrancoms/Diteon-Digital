import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { Logo } from './Logo'
import type { SolutionOptionValue } from '../config/solutionOptions'

const nav = [
  ['soluciones','Soluciones'],
  ['producto','Producto'],
  ['ingenieria','Ingeniería'],
  ['metodologia','Metodología'],
  ['integraciones','Integraciones'],
] as const

export function Header({ onContact }: { onContact: (solution?: SolutionOptionValue) => void }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('inicio')
  const [progress, setProgress] = useState(0)
  const dark = active === 'ingenieria'

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 18)
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      setProgress(Math.min(1, window.scrollY / max))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible?.target.id) setActive(visible.target.id)
    }, { rootMargin: '-32% 0px -58% 0px', threshold: [0,.1,.25,.5,.75] })

    ;['inicio', ...nav.map(x => x[0])].forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''} ${dark ? 'site-header--dark' : ''}`}>
      <div className="header-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      <div className="shell site-header__inner">
        <Logo light={dark} />
        <nav className="desktop-nav" aria-label="Navegación principal">
          {nav.map(([id,label]) => (
            <a key={id} className={active===id?'active':''} href={`#${id}`}>{label}</a>
          ))}
        </nav>
        <button className={`button desktop-cta ${dark ? 'button--light-outline' : 'button--dark'}`} onClick={() => onContact('otro')}>
          Hablemos <ArrowUpRight size={15}/>
        </button>
        <button className="menu-button" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X size={21}/> : <Menu size={21}/>} 
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div className={`mobile-menu ${dark ? 'mobile-menu--dark' : ''}`} initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.2}}>
            {nav.map(([id,label],i)=><a key={id} href={`#${id}`} onClick={()=>setOpen(false)}><span>0{i+1}</span>{label}</a>)}
            <button className={`button ${dark ? 'button--bone' : 'button--dark'}`} onClick={()=>{setOpen(false);onContact('otro')}}>Hablemos <ArrowUpRight size={16}/></button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
