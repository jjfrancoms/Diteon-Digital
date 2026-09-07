import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

const rows = [
  ['Datos repartidos en Excel, chats y cuadernos','Una sola fuente de verdad conectada a tu operación.'],
  ['Seguimientos que dependen de memoria','Flujos, estados y tareas con trazabilidad.'],
  ['Inventario y caja sin visibilidad inmediata','Lectura operativa en el momento de decidir.'],
  ['Tareas repetitivas y traspasos manuales de información','APIs, webhooks y automatizaciones con trazabilidad.'],
]

export function ProblemPromise() {
  const reduced = useReducedMotion()
  return (
    <section className="editorial-section" id="problema">
      <div className="shell">
        <div className="editorial-intro">
          <div><span className="section-kicker">01 · El problema</span><h2>Tu negocio no necesita más herramientas aisladas. Necesita <em>una operación coherente.</em></h2></div>
          <p>Cuando la información vive en lugares distintos, cada venta, seguimiento o cierre exige trabajo manual. DITEON diseña el sistema alrededor del flujo real, no al revés.</p>
        </div>
        <div className="transformation-list">
          <div className="transformation-list__head"><span>Hoy</span><span>Transformación</span><span>Con DITEON</span></div>
          {rows.map(([before, after], i) => (
            <motion.div className="transformation-row" key={before} initial={reduced?false:{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.45}} transition={{duration:.45,delay:i*.04}}>
              <div><b>0{i+1}</b><p>{before}</p></div><div className="transform-arrow"><span/><ArrowRight size={18}/></div><p>{after}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
