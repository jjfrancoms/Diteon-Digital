import { PointerEvent as ReactPointerEvent, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Layers3 } from 'lucide-react'
import { DiteonSystemCore } from './DiteonSystemCore'

const layers = [
  {n:'01',title:'Tu negocio',tag:'OPERACIÓN',desc:'Procesos, personas, reglas y decisiones reales.'},
  {n:'02',title:'Experiencia',tag:'INTERFAZ',desc:'Una interfaz clara para cada rol y contexto.'},
  {n:'03',title:'Ingeniería',tag:'LÓGICA + DATOS',desc:'Permisos, datos, automatizaciones e integraciones.'},
  {n:'04',title:'Infraestructura',tag:'CLOUD + SEGURIDAD',desc:'Despliegue, observabilidad, backups y capacidad de evolución.'},
]

export function Engineering() {
  const [active,setActive] = useState(2)
  const reduced = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)

  function move(e:ReactPointerEvent<HTMLDivElement>){
    if(!cardRef.current)return
    const r=cardRef.current.getBoundingClientRect()
    cardRef.current.style.setProperty('--spot-x',`${e.clientX-r.left}px`)
    cardRef.current.style.setProperty('--spot-y',`${e.clientY-r.top}px`)
  }

  return (
    <section className="engineering" id="ingenieria">
      <div className="engineering__grid" aria-hidden="true"/>
      <div className="shell engineering__header">
        <span className="section-kicker section-kicker--light">04 · Ingeniería</span>
        <h2>La experiencia visible y la arquitectura interna <em>trabajan juntas.</em></h2>
        <p>Cada interfaz que entregamos se apoya en una arquitectura pensada para datos, permisos, integraciones, seguridad y evolución.</p>
      </div>

      <div className="shell engineering__workspace">
        <div className="engineering__rail" role="tablist" aria-label="Capas del sistema">
          {layers.map((layer,index)=><button key={layer.n} role="tab" aria-selected={active===index} className={active===index?'active':''} onClick={()=>setActive(index)}><span>{layer.n}</span><div><b>{layer.title}</b><small>{layer.tag}</small></div><i/></button>)}
        </div>
        <div className="engineering-card" ref={cardRef} onPointerMove={move}>
          <div className="engineering-spotlight" aria-hidden="true"/>
          <div className="engineering-card__copy">
            <div className="engineering-live"><i/> SISTEMA DITEON</div>
            <motion.div key={active} initial={reduced?false:{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.35}}>
              <span>{layers[active].n} / {layers[active].tag}</span>
              <h3>{layers[active].title}</h3>
              <p>{layers[active].desc}</p>
            </motion.div>
            <div className="engineering-hint"><Layers3 size={13}/> Arquitectura modular · capas independientes</div>
          </div>
          <div className="engineering-card__scene"><DiteonSystemCore active={active}/></div>
        </div>
      </div>
    </section>
  )
}
