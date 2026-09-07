import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Search, PenTool, Code2, ShieldCheck, Rocket } from 'lucide-react'

const steps = [
  {
    n: '01',
    title: 'Entender',
    desc: 'Mapeamos cómo funciona hoy tu negocio, quién participa en cada proceso, qué información circula y dónde se pierde tiempo, control o contexto.',
    icon: Search,
    bullets: ['Flujo actual', 'Usuarios y roles', 'Problemas reales', 'Riesgos', 'Prioridades'],
    visualLead: 'Leemos el negocio antes de proponer una solución.',
    visualTags: ['Contexto', 'Actores', 'Fricción'],
  },
  {
    n: '02',
    title: 'Diseñar',
    desc: 'Convertimos el problema en una solución concreta antes de escribir código: definimos experiencia, datos, reglas, integraciones y alcance por fases.',
    icon: PenTool,
    bullets: ['Arquitectura funcional', 'UX / UI', 'Modelo de datos', 'Integraciones', 'Alcance por fases'],
    visualLead: 'Aterrizamos estructura, recorrido y reglas del sistema.',
    visualTags: ['Experiencia', 'Datos', 'Alcance'],
  },
  {
    n: '03',
    title: 'Construir',
    desc: 'Desarrollamos una base mantenible, modular y preparada para crecer, conectando interfaz, lógica, datos, automatizaciones y permisos.',
    icon: Code2,
    bullets: ['Frontend', 'Backend', 'Base de datos', 'Automatizaciones', 'Permisos y seguridad'],
    visualLead: 'Conectamos las capas que sostienen la operación real.',
    visualTags: ['Interfaz', 'Lógica', 'Datos'],
  },
  {
    n: '04',
    title: 'Validar',
    desc: 'Probamos la solución contra los procesos reales del negocio, no solo contra pantallas, antes de llevarla a producción.',
    icon: ShieldCheck,
    bullets: ['QA funcional', 'Responsive', 'Flujos críticos', 'Roles y permisos', 'Pruebas de integración'],
    visualLead: 'Verificamos que el sistema resista el uso real.',
    visualTags: ['Pruebas', 'Ajustes', 'Seguridad'],
  },
  {
    n: '05',
    title: 'Lanzar y evolucionar',
    desc: 'Ponemos el sistema en producción, observamos su uso y dejamos una base documentada y lista para seguir mejorando por módulos.',
    icon: Rocket,
    bullets: ['Deploy', 'Monitoreo', 'Ajustes', 'Documentación', 'Evolución por módulos'],
    visualLead: 'Publicamos, observamos y mejoramos sin rehacer la base.',
    visualTags: ['Deploy', 'Observabilidad', 'Mejora'],
  },
]

export function Process() {
  const [active,setActive] = useState(0)
  const refs = useRef<Array<HTMLElement|null>>([])
  const reduced = useReducedMotion()

  useEffect(()=>{
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const center = window.innerHeight * .5
        let bestIndex = 0
        let bestDistance = Number.POSITIVE_INFINITY
        refs.current.forEach((el,index) => {
          if (!el) return
          const rect = el.getBoundingClientRect()
          const distance = Math.abs(rect.top + rect.height * .5 - center)
          if (distance < bestDistance) {
            bestDistance = distance
            bestIndex = index
          }
        })
        setActive(current => current === bestIndex ? current : bestIndex)
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return()=>{
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  },[])

  const current = steps[active]
  const ActiveIcon=current.icon

  return <section className="process" id="metodologia">
    <div className="shell process__heading"><span className="section-kicker">05 · Metodología</span><h2>Diseño e ingeniería avanzan <em>juntos.</em></h2><p>Trabajamos por fases claras para reducir incertidumbre, validar decisiones y construir sobre una base mantenible.</p></div>
    <div className="shell process__layout">
      <div className="process__sticky">
        <div className="process-visual" aria-live="polite">
          <div className="process-visual__head"><span>FASE {current.n}</span><small>{String(active+1).padStart(2,'0')} / {String(steps.length).padStart(2,'0')}</small></div>
          <AnimatePresence mode="wait"><motion.div key={active} className="process-visual__body" initial={reduced?false:{opacity:0,x:22}} animate={{opacity:1,x:0}} exit={reduced?undefined:{opacity:0,x:-18}} transition={{duration:.32,ease:[.16,1,.3,1]}}><div className="process-icon"><ActiveIcon size={30}/></div><h3>{current.title}</h3><p>{current.visualLead}</p><div className="process-focus-tags">{current.visualTags.map(tag=><span key={tag}>{tag}</span>)}</div></motion.div></AnimatePresence>
          <div className="process-progress"><i style={{height:`${((active+1)/steps.length)*100}%`}}/>{steps.map((s,i)=><button key={s.n} className={active===i?'active':''} onClick={()=>refs.current[i]?.scrollIntoView({behavior:reduced?'auto':'smooth',block:'center'})} aria-label={`Ir a ${s.title}`}><span>{s.n}</span></button>)}</div>
          <div className={`process-diagram process-diagram--${active}`} aria-hidden="true"><span className="pd-node pd-1"/><span className="pd-node pd-2"/><span className="pd-node pd-3"/><span className="pd-node pd-4"/><i className="pd-line pd-l1"/><i className="pd-line pd-l2"/><i className="pd-line pd-l3"/></div>
        </div>
      </div>
      <div className="process__steps">{steps.map((s,i)=><article key={s.n} data-index={i} ref={el=>{refs.current[i]=el}} className={active===i?'active':''}><span>{s.n}</span><div><h3>{s.title}</h3><p>{s.desc}</p><ul>{s.bullets.map(x=><li key={x}>{x}</li>)}</ul></div></article>)}</div>
    </div>
  </section>
}
