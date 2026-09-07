import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

const layerLabels = ['OPERACIÓN','EXPERIENCIA','LÓGICA + DATOS','INFRAESTRUCTURA']

export function DiteonSystemCore({ active }: { active: number }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref,{amount:.25})
  return (
    <div ref={ref} className="system-core" aria-label="Representación tridimensional por capas de la arquitectura DITEON">
      <div className="system-core__glow" aria-hidden="true" />
      <div className="system-core__stage" aria-hidden="true">
        {layerLabels.map((label,index)=>(
          <div key={label} className={`system-core__slot system-core__slot--${index+1}`}>
            <motion.div
              className={`system-core__plate ${active===index?'active':''}`}
              animate={reduced?undefined:{y:active===index?-7:0,scale:active===index?1.025:1,opacity:active===index?1:.72}}
              transition={{duration:.42,ease:[.16,1,.3,1]}}
            >
              <span>{String(index+1).padStart(2,'0')}</span>
              <b>{label}</b>
            </motion.div>
          </div>
        ))}
        <div className="system-core__mark-frame">
          <motion.div className="system-core__mark" animate={reduced?undefined:(inView?{y:[0,-4,0],scale:[1,1.025,1]}:{y:0,scale:1})} transition={{duration:7.5,repeat:Infinity,ease:'easeInOut'}}>
            <svg viewBox="0 0 1000 1000" role="img" aria-label="Isotipo DITEON">
              <defs>
                <linearGradient id="systemCoreGradient" x1="230" y1="210" x2="760" y2="760" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1C6FE0" />
                  <stop offset="0.52" stopColor="#7B61FF" />
                  <stop offset="1" stopColor="#FF6B35" />
                </linearGradient>
              </defs>
              <g fill="none" stroke="url(#systemCoreGradient)" strokeWidth="78" strokeLinecap="round" strokeLinejoin="round">
                <line x1="332" y1="246" x2="395" y2="742" />
                <line x1="332" y1="246" x2="684" y2="449" />
                <line x1="395" y1="742" x2="684" y2="449" />
              </g>
              <g fill="url(#systemCoreGradient)">
                <circle cx="332" cy="246" r="120" />
                <circle cx="395" cy="742" r="120" />
                <circle cx="684" cy="449" r="120" />
              </g>
            </svg>
          </motion.div>
        </div>
      </div>
      <div className="system-core__legend">
        <span>CAPA ACTIVA</span>
        <b>{layerLabels[active]}</b>
      </div>
    </div>
  )
}
