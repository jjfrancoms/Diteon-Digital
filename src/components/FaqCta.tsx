import { KeyboardEvent, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, ArrowRight } from 'lucide-react'
import { BackgroundPaths } from './BackgroundPaths'
import type { SolutionOptionValue } from '../config/solutionOptions'
import { trackEvent } from '../services/analytics'

const faqs = [
  ['¿DITEON trabaja solo con empresas grandes?','No. El criterio principal es que exista un proceso real que valga la pena ordenar, conectar o automatizar. El alcance se adapta a la etapa del negocio.'],
  ['¿Puedo empezar por un módulo pequeño?','Sí. Diseñamos una arquitectura modular para comenzar por el punto de mayor impacto y ampliar después sin rehacer todo el sistema.'],
  ['¿Cómo se define la propiedad del software?','La propiedad del código, documentación y entregables se acuerda desde el inicio y queda expresada en el alcance contractual antes de comenzar el desarrollo.'],
  ['¿Integran WhatsApp, APIs o herramientas existentes?','Sí. Diseñamos integraciones según disponibilidad de APIs, permisos, seguridad, webhooks, reintentos y reglas del proceso.'],
  ['¿Cuánto tarda un proyecto?','Depende del alcance, cantidad de roles, integraciones y complejidad del proceso. Preferimos dividir el trabajo en fases entregables para validar antes de ampliar.'],
  ['¿Qué pasa después del lanzamiento?','Definimos soporte, monitoreo, correcciones y evolución según el proyecto. La arquitectura queda preparada para añadir módulos sin reconstruir la base.'],
  ['¿Cómo cotizan un proyecto?','Primero entendemos objetivo, usuarios, alcance, integraciones y riesgos. Con eso proponemos fases y un alcance defendible antes de hablar de una cifra cerrada.'],
]

export function FaqCta({onContact}:{onContact:(solution?:SolutionOptionValue)=>void}){
  const [open,setOpen]=useState(0)
  const buttons=useRef<Array<HTMLButtonElement|null>>([])

  const onKey=(e:KeyboardEvent<HTMLButtonElement>,i:number)=>{
    if(!['ArrowDown','ArrowUp','Home','End'].includes(e.key))return
    e.preventDefault()
    let next=i
    if(e.key==='ArrowDown')next=(i+1)%faqs.length
    if(e.key==='ArrowUp')next=(i-1+faqs.length)%faqs.length
    if(e.key==='Home')next=0
    if(e.key==='End')next=faqs.length-1
    buttons.current[next]?.focus()
  }

  return (
    <>
      <section className="faq" id="faq">
        <div className="shell faq__layout">
          <div>
            <span className="section-kicker">07 · Preguntas frecuentes</span>
            <h2>Lo importante antes de <em>empezar.</em></h2>
            <p className="faq__intro">Acordamos alcance, propiedad, integraciones y forma de trabajo antes de construir.</p>
          </div>
          <div className="faq__items">
            {faqs.map(([q,a],i)=>{
              const isOpen=open===i
              return (
                <article key={q} className={isOpen?'open':''}>
                  <button ref={el=>{buttons.current[i]=el}} onKeyDown={e=>onKey(e,i)} onClick={()=>{setOpen(isOpen?-1:i);if(!isOpen)trackEvent('faq_opened',{question:q})}} aria-expanded={isOpen} aria-controls={`faq-panel-${i}`} id={`faq-trigger-${i}`}>
                    <span>{q}</span><Plus size={18}/>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen&&<motion.div id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-trigger-${i}`} className="faq-answer" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.28,ease:[.16,1,.3,1]}}><p>{a}</p></motion.div>}
                  </AnimatePresence>
                </article>
              )
            })}
          </div>
        </div>
      </section>
      <section className="final-cta">
        <BackgroundPaths/>
        <div className="final-cta__glow" aria-hidden="true"/>
        <div className="shell final-cta__content">
          <span>Tu próxima operación puede ser más simple.</span>
          <h2>Construyamos el sistema que tu negocio <em>realmente necesita.</em></h2>
          <p>Cuéntanos cómo trabajas hoy y dónde se está perdiendo tiempo, control o información.</p>
          <button className="button button--bone button--large" onClick={() => onContact('otro')}>Hablar con DITEON <ArrowRight size={18}/></button>
        </div>
      </section>
    </>
  )
}
