import { useMemo, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Database, MessageCircle, Globe2, Github, Cloud, Webhook, Mail, Network } from 'lucide-react'
import { TechMarquee } from './TechMarquee'

const nodes = [
  {id:'supabase',title:'Supabase',icon:Database,desc:'Datos, autenticación, permisos y Realtime.',related:['whatsapp','webhooks','rest']},
  {id:'whatsapp',title:'WhatsApp',icon:MessageCircle,desc:'Mensajes, leads y automatización conversacional.',related:['supabase','webhooks','meta']},
  {id:'meta',title:'Meta APIs',icon:Globe2,desc:'Canales y eventos del ecosistema Meta.',related:['whatsapp','webhooks']},
  {id:'github',title:'GitHub',icon:Github,desc:'Código, ramas, revisión y automatización de entrega.',related:['vercel']},
  {id:'vercel',title:'Vercel',icon:Cloud,desc:'Previews, despliegues y producción.',related:['github','webhooks']},
  {id:'webhooks',title:'Webhooks',icon:Webhook,desc:'Eventos confiables entre sistemas.',related:['supabase','whatsapp','rest','vercel']},
  {id:'email',title:'Email',icon:Mail,desc:'Notificaciones y flujos transaccionales.',related:['webhooks']},
  {id:'rest',title:'REST APIs',icon:Network,desc:'Conexión con servicios externos y sistemas existentes.',related:['supabase','webhooks']},
] as const

type NodeId = (typeof nodes)[number]['id']

export function Integrations(){
  const [active,setActive]=useState(0)
  const reduced=useReducedMotion()
  const sectionRef=useRef<HTMLElement>(null)
  const inView=useInView(sectionRef,{amount:.18,margin:'-8% 0px -8% 0px'})
  const item=nodes[active]
  const Icon=item.icon

  const orbitalNodes=useMemo(()=>{
    const outer=nodes.map((node,index)=>({node,index})).filter(entry=>entry.index!==active)
    return outer.map((entry,outerIndex)=>{
      const angle=(-90+outerIndex*(360/outer.length))*Math.PI/180
      const radius=40
      return {...entry,x:50+Math.cos(angle)*radius,y:50+Math.sin(angle)*radius}
    })
  },[active])

  const relatedSet=useMemo(()=>new Set<NodeId>(item.related as readonly NodeId[]),[item.related])

  return (
    <section className="integrations" id="integraciones" ref={sectionRef}>
      <div className="shell integrations__intro">
        <span className="section-kicker">06 · Tecnología e integraciones</span>
        <h2>Tu sistema debe conversar con <em>las herramientas que ya usas.</em></h2>
        <p>Selecciona una integración para ver cómo se relaciona con las demás piezas de una arquitectura conectada.</p>
      </div>

      <div className="shell"><TechMarquee /></div>

      <div className="shell integration-board integration-board--orbital">
        <div className="integration-copy">
          <span className="integration-mini">INTEGRACIÓN SELECCIONADA</span>
          <motion.div key={item.id} initial={reduced?false:{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.28,ease:[.16,1,.3,1]}}>
            <div className="integration-selected-icon"><Icon size={25}/></div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <small>Se relaciona con: {item.related.map(id=>nodes.find(n=>n.id===id)?.title).join(' · ')}</small>
          </motion.div>
        </div>
        <div className={`orbital orbital--connected ${inView?'is-running':''}`} role="group" aria-label="Mapa interactivo de integraciones">
          <div className="orbital-ring orbital-ring--1"/><div className="orbital-ring orbital-ring--2"/><div className="orbital-ring orbital-ring--3"/>
          <svg className="orbital-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {orbitalNodes.map(({node,x,y},index)=>{
              const connected=relatedSet.has(node.id)
              return <g key={node.id}>
                <motion.line x1="50" y1="50" vectorEffect="non-scaling-stroke" initial={false} animate={{x2:x,y2:y,strokeOpacity:connected ? .7 : .1,strokeWidth:connected?1.15:.55}} transition={{duration:.42,ease:[.16,1,.3,1]}} />
                {connected && !reduced && inView && <motion.circle r="0.72" className="orbital-signal" initial={{cx:50,cy:50,opacity:0}} animate={{cx:[50,x],cy:[50,y],opacity:[0,1,1,0]}} transition={{duration:2.6,delay:index*.34,repeat:Infinity,repeatDelay:1.2,ease:'linear'}} />}
              </g>
            })}
          </svg>
          <motion.button key={item.id} className="orbit-center orbit-center--integration" onClick={()=>setActive((active+1)%nodes.length)} aria-label={`${item.title}. Seleccionar siguiente integración`} initial={reduced?false:{opacity:.6}} animate={{opacity:1}} transition={{duration:.32,ease:[.16,1,.3,1]}}>
            <Icon size={27}/><b>{item.title}</b><span>DITEON</span><i className={inView?'running':''}/>
          </motion.button>
          {orbitalNodes.map(({node,index,x,y})=>{
            const NodeIcon=node.icon
            const connected=relatedSet.has(node.id)
            return <motion.button key={node.id} className={`orbit-node ${connected?'related':''}`} style={{left:`${x}%`,top:`${y}%`}} onClick={()=>setActive(index)} animate={{opacity:connected?1:.68}} transition={{duration:.28,ease:[.16,1,.3,1]}} aria-label={`Seleccionar ${node.title}`} title={node.title}><i><NodeIcon size={17}/></i><span>{node.title}</span></motion.button>
          })}
        </div>
      </div>
    </section>
  )
}
