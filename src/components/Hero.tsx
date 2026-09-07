import { PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { ArrowRight, Check, MessageSquareText, Database, Boxes, Sparkles } from 'lucide-react'
import type { SolutionOptionValue } from '../config/solutionOptions'
import { trackEvent } from '../services/analytics'

const productSlides = [
  { id:'crm', label:'CRM / Control', src:'/images/showcase/diteon-crm-showcase.webp', alt:'Panel CRM DITEON' },
  { id:'pos', label:'POS / Inventario', src:'/images/showcase/diteon-pos-showcase.webp', alt:'Panel POS DITEON' },
]

export function Hero({ onContact }: { onContact: (solution?: SolutionOptionValue) => void }) {
  const reduced = useReducedMotion()
  const [slide, setSlide] = useState(0)
  const heroRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const inView = useInView(heroRef,{amount:.12,margin:'-8% 0px -8% 0px'})
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateY = useSpring(mx, { stiffness: 90, damping: 18 })
  const rotateX = useSpring(my, { stiffness: 90, damping: 18 })

  useEffect(() => {
    if (reduced || !inView) return
    const id = window.setInterval(()=>setSlide(s=>(s+1)%productSlides.length), 5600)
    return () => clearInterval(id)
  }, [reduced,inView])

  function pointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (reduced || !stageRef.current) return
    const r = stageRef.current.getBoundingClientRect()
    mx.set(((e.clientX-r.left)/r.width-.5)*4.5)
    my.set(-((e.clientY-r.top)/r.height-.5)*3.5)
    stageRef.current.style.setProperty('--mx', `${e.clientX-r.left}px`)
    stageRef.current.style.setProperty('--my', `${e.clientY-r.top}px`)
  }

  function pointerLeave(){
    mx.set(0)
    my.set(0)
  }

  return (
    <section className="hero" id="inicio" ref={heroRef}>
      <div className="hero__aurora" aria-hidden="true"/>
      <div className="hero__grid" aria-hidden="true"/>
      <div className="shell hero__inner">
        <motion.div className="hero__copy" initial={reduced?false:{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.7,ease:[.16,1,.3,1]}}>
          <div className="announcement"><Sparkles size={13}/><span>Software operativo diseñado alrededor de tu negocio</span><i/>Arquitectura a medida</div>
          <div className="eyebrow"><span className="eyebrow__line"/> Ingeniería de software para negocios reales</div>
          <h1>De procesos dispersos a <span className="hero-gradient">una operación conectada.</span></h1>
          <p className="hero__lead">CRM, POS, ERP, automatización e integraciones diseñados alrededor de cómo funciona tu negocio — no alrededor de una plantilla.</p>
          <div className="hero__actions">
            <button className="button button--primary button--large" onClick={() => { trackEvent('hero_contact_click'); onContact('otro') }}>Cuéntanos tu proyecto <ArrowRight size={18}/></button>
            <a className="text-link" href="#producto">Ver producto <span>↓</span></a>
          </div>
          <div className="hero__trustline">
            <span><Check size={15}/> Propiedad definida desde el inicio</span>
            <span><Check size={15}/> Modular y escalable</span>
            <span><Check size={15}/> Integraciones reales</span>
          </div>
        </motion.div>

        <motion.div ref={stageRef} className="product-stage product-stage--interactive" onPointerMove={pointerMove} onPointerLeave={pointerLeave} style={reduced?undefined:{rotateX,rotateY}} initial={reduced?false:{opacity:0,y:32,scale:.96}} animate={{opacity:1,y:0,scale:1}} transition={{duration:.9,delay:.12,ease:[.16,1,.3,1]}}>
          <div className="product-stage__cursor-glow" aria-hidden="true"/>
          <div className="product-stage__halo" aria-hidden="true"/>
          <div className="product-window">
            <div className="product-window__bar">
              <div className="traffic"><i/><i/><i/></div>
              <span>DITEON / producto demo</span>
              <span className="window-badge">DEMO</span>
            </div>
            <div className="product-tabs" role="tablist" aria-label="Demos de producto">
              {productSlides.map((item,i)=><button key={item.id} role="tab" aria-selected={slide===i} className={slide===i?'active':''} onClick={()=>setSlide(i)}>{item.label}</button>)}
            </div>
            <div className="product-media">
              {productSlides.map((item,i)=><motion.img key={item.id} src={item.src} alt={item.alt} animate={{opacity:slide===i?1:0,scale:slide===i?1:.985}} transition={{duration:.45,ease:[.16,1,.3,1]}} aria-hidden={slide!==i}/>) }
            </div>
          </div>
          <motion.div className="floating-note floating-note--one" animate={reduced?undefined:{y:inView?[0,-4,0]:0}} transition={{repeat:Infinity,duration:4.8,ease:'easeInOut'}}><MessageSquareText size={15}/><div><strong>Lead conectado</strong><span>WhatsApp → CRM</span></div></motion.div>
          <motion.div className="floating-note floating-note--two" animate={reduced?undefined:{y:inView?[0,4,0]:0}} transition={{repeat:Infinity,duration:5.6,ease:'easeInOut'}}><Database size={14}/><div><strong>Datos sincronizados</strong><span>Realtime</span></div></motion.div>
          <motion.div className="floating-note floating-note--three" animate={reduced?undefined:{x:inView?[0,3,0]:0,y:inView?[0,-2,0]:0}} transition={{repeat:Infinity,duration:6.4,ease:'easeInOut'}}><Boxes size={14}/><div><strong>Stock y caja</strong><span>Misma operación</span></div></motion.div>
        </motion.div>
      </div>
      <div className="hero__foot shell"><span>Software a medida</span><span>Automatización</span><span>Integraciones</span><span>Producto digital</span></div>
    </section>
  )
}
