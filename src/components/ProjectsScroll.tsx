import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { SolutionOptionValue } from '../config/solutionOptions'
import { trackEvent } from '../services/analytics'

export function ProjectsScroll({ onContact }: { onContact: (solution?: SolutionOptionValue) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end','end start'] })
  const smooth = useSpring(scrollYProgress,{stiffness:78,damping:28,mass:.42})
  const rotateX = useTransform(smooth,[0,.22,.5,.82,1],reduced?[0,0,0,0,0]:[8,5,0,-1.5,-2.5])
  const rotateZ = useTransform(smooth,[0,.5,1],reduced?[0,0,0]:[-.55,0,.22])
  const scale = useTransform(smooth,[0,.22,.5,.82,1],reduced?[1,1,1,1,1]:[.91,.95,1,.985,.97])
  const y = useTransform(smooth,[0,.22,.5,.82,1],reduced?[0,0,0,0,0]:[72,42,0,-18,-28])

  return (
    <section className="projects" id="producto" ref={ref}>
      <div className="shell projects__intro">
        <span className="section-kicker">03 · Producto</span>
        <h2>Una interfaz clara para <em>una operación completa.</em></h2>
        <p>El producto visible concentra clientes, ventas, actividades, permisos e información operativa sin obligarte a saltar entre herramientas.</p>
      </div>
      <div className="project-scroll-space">
        <div className="project-sticky-stage">
          <motion.div className="project-stage" style={reduced?undefined:{rotateX,rotateZ,scale,y}}>
            <div className="project-stage__shine" aria-hidden="true"/>
            <div className="project-stage__frame"><img src="/images/showcase/diteon-crm-showcase.webp" alt="Ejemplo visual de un panel CRM DITEON"/></div>
            <div className="project-stage__caption">
              <div><span>CRM / Operaciones</span><h3>Ventas, clientes y seguimiento en un solo control central.</h3></div>
              <button className="project-contact-button" type="button" onClick={() => { trackEvent('solution_cta_click', { solution: 'crm' }); onContact('crm') }} aria-label="Consultar por CRM"><ArrowUpRight/></button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
