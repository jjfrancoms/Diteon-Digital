import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Boxes, Workflow, Gauge, Database, ShoppingCart, Users, MessageSquare, RefreshCw } from 'lucide-react'
import type { SolutionOptionValue } from '../config/solutionOptions'
import { trackEvent } from '../services/analytics'

type Tag = { label: string; solution: SolutionOptionValue }

type ServiceItem = {
  num: string
  solution: SolutionOptionValue
  title: string
  lead: string
  text: string
  tags: Tag[]
  icon: typeof Boxes
  visual: 'systems' | 'flow' | 'product'
}

const services: ServiceItem[] = [
  {
    num:'01',
    solution:'crm',
    title:'Sistemas de gestión',
    lead:'CRM, POS, ERP e inventario alrededor de tu operación.',
    text:'Centralizamos clientes, ventas, stock, caja y seguimiento en una experiencia diseñada para cada rol.',
    tags:[
      {label:'CRM',solution:'crm'},
      {label:'POS',solution:'pos'},
      {label:'ERP',solution:'erp'},
      {label:'Inventario',solution:'inventario'},
    ],
    icon:Boxes,
    visual:'systems',
  },
  {
    num:'02',
    solution:'automatizacion',
    title:'Automatización e integraciones',
    lead:'Conecta las piezas que hoy obligan a copiar, revisar y repetir.',
    text:'Integramos WhatsApp, APIs, bases de datos, formularios y servicios externos con trazabilidad y reintentos.',
    tags:[
      {label:'WhatsApp',solution:'automatizacion'},
      {label:'APIs',solution:'automatizacion'},
      {label:'Webhooks',solution:'automatizacion'},
      {label:'Automatización',solution:'automatizacion'},
    ],
    icon:Workflow,
    visual:'flow',
  },
  {
    num:'03',
    solution:'a-medida',
    title:'Productos digitales',
    lead:'Webs, paneles y plataformas construidos para representar tu negocio.',
    text:'Diseñamos experiencias responsivas, accesibles y mantenibles para producto, operación y clientes.',
    tags:[
      {label:'Web Apps',solution:'a-medida'},
      {label:'Dashboards',solution:'a-medida'},
      {label:'Portales',solution:'a-medida'},
      {label:'SaaS',solution:'a-medida'},
    ],
    icon:Gauge,
    visual:'product',
  },
]

const flowNodes = [
  { id:'client', label:'Cliente', icon:Users, x:16, y:54 },
  { id:'automation', label:'Automatización', icon:Workflow, x:50, y:24 },
  { id:'data', label:'Datos', icon:Database, x:84, y:54 },
  { id:'operation', label:'Operación', icon:ShoppingCart, x:50, y:82 },
] as const

const flowLinks = [
  ['client','automation'],
  ['automation','data'],
  ['automation','operation'],
  ['data','operation'],
] as const

export function Services({ onContact }: { onContact: (solution?: SolutionOptionValue) => void }) {
  const reduced = useReducedMotion()
  const open = (solution: SolutionOptionValue) => {
    trackEvent('solution_contact_click', { solution })
    onContact(solution)
  }

  return (
    <section className="services" id="soluciones">
      <div className="shell services__top">
        <span className="section-kicker">02 · Soluciones</span>
        <h2>Construimos la capa digital que hace que tu operación <em>funcione mejor.</em></h2>
      </div>
      <div className="service-stack">
        {services.map((service,index)=>{
          const Icon = service.icon
          return (
            <motion.article className={`service-row shell service-row--${index+1}`} key={service.title} initial={reduced?false:{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.22}} transition={{duration:.55,ease:[.16,1,.3,1]}}>
              <div className="service-row__copy">
                <div className="service-num">{service.num}</div>
                <Icon size={25} strokeWidth={1.55}/>
                <h3>{service.title}</h3>
                <p className="service-lead">{service.lead}</p>
                <p>{service.text}</p>
                <div className="tag-list tag-list--interactive">
                  {service.tags.map(tag => <button key={tag.label} type="button" onClick={() => open(tag.solution)}>{tag.label}</button>)}
                </div>
                <button className="text-button" type="button" onClick={() => open(service.solution)}>Hablar sobre esta solución <ArrowUpRight size={16}/></button>
              </div>
              <ServiceVisual type={service.visual} reduced={!!reduced}/>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}

function ServiceVisual({type,reduced}:{type:ServiceItem['visual'];reduced:boolean}) {
  if(type==='systems') {
    return (
      <div className="service-visual service-visual--systems">
        <motion.figure className="systems-shot systems-shot--crm" animate={reduced?undefined:{y:[0,-3,0]}} transition={{duration:7.2,repeat:Infinity,ease:'easeInOut'}}>
          <img src="/images/showcase/diteon-crm-showcase.webp" alt="Vista de CRM DITEON" />
          <figcaption>CRM / seguimiento</figcaption>
        </motion.figure>
        <motion.figure className="systems-shot systems-shot--pos" animate={reduced?undefined:{y:[0,4,0]}} transition={{duration:8.2,repeat:Infinity,ease:'easeInOut'}}>
          <img src="/images/showcase/diteon-pos-showcase.webp" alt="Vista de POS e inventario DITEON" />
          <figcaption>POS / inventario</figcaption>
        </motion.figure>
      </div>
    )
  }

  if(type==='flow') {
    const byId = Object.fromEntries(flowNodes.map(node => [node.id,node])) as Record<(typeof flowNodes)[number]['id'],(typeof flowNodes)[number]>
    return (
      <div className="service-visual service-visual--flow" aria-label="Flujo de integración entre cliente, automatización, datos y operación">
        <svg className="flow-map" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {flowLinks.map(([fromId,toId],index)=>{
            const from=byId[fromId]
            const to=byId[toId]
            return (
              <g key={`${fromId}-${toId}`}>
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="flow-map__line" vectorEffect="non-scaling-stroke" />
                {!reduced && <motion.circle r="0.8" className="flow-map__signal" initial={{cx:from.x,cy:from.y,opacity:0}} animate={{cx:[from.x,to.x],cy:[from.y,to.y],opacity:[0,1,1,0]}} transition={{duration:2.8,delay:index*.62,repeat:Infinity,repeatDelay:1.1,ease:'linear'}} />}
              </g>
            )
          })}
        </svg>
        {flowNodes.map(({id,label,icon:NodeIcon,x,y},index)=><motion.div key={id} className={`flow-node flow-node--${id}`} style={{left:`${x}%`,top:`${y}%`}} animate={reduced?undefined:{scale:[1,1.025,1]}} transition={{duration:4.8+index*.35,repeat:Infinity,ease:'easeInOut'}}><NodeIcon/><span>{label}</span></motion.div>)}
        <div className="flow-event flow-event--one"><MessageSquare size={12}/> nuevo lead</div>
        <div className="flow-event flow-event--two"><RefreshCw size={12}/> evento procesado</div>
      </div>
    )
  }

  return (
    <div className="service-visual service-visual--product">
      <motion.div className="custom-product-frame" animate={reduced?undefined:{y:[0,-3,0]}} transition={{duration:8,repeat:Infinity,ease:'easeInOut'}}>
        <img src="/demos/custom.svg" alt="Ejemplo de portal operativo a medida diseñado por DITEON" />
      </motion.div>
      <div className="custom-product-note"><span>Producto a medida</span><b>Un flujo propio, no una plantilla.</b></div>
    </div>
  )
}
