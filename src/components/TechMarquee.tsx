const tech = [
  {name:'React',src:'/brands/react.svg'},
  {name:'TypeScript',src:'/brands/typescript.svg'},
  {name:'Supabase',src:'/brands/supabase.svg'},
  {name:'PostgreSQL',src:'/brands/postgresql.svg'},
  {name:'GitHub',src:'/brands/github.svg'},
  {name:'WhatsApp',src:'/brands/whatsapp.svg'},
  {name:'Vercel',src:'/brands/vercel.svg'},
  {name:'Meta',src:'/brands/meta.svg'},
] as const

function Group({copy}:{copy:number}) {
  return <div className="marquee-group" aria-hidden={copy===2}>{tech.map(item=><span className="tech-chip tech-chip--brand" key={`${copy}-${item.name}`}><i><img src={item.src} alt="" /></i>{item.name}</span>)}</div>
}

function Lane({reverse=false}:{reverse?:boolean}) {
  return (
    <div className={`marquee-lane ${reverse?'reverse':''}`}>
      <div className="marquee-track"><Group copy={1}/><Group copy={2}/></div>
    </div>
  )
}

export function TechMarquee() {
  return (
    <div className="tech-section tech-section--embedded" aria-label="Tecnologías utilizadas por DITEON">
      <div className="tech-section__label">
        <span className="section-kicker">Tecnología elegida para durar</span>
        <p>Elegimos herramientas por mantenibilidad, rendimiento, seguridad e integración.</p>
      </div>
      <div className="marquee-mask" tabIndex={0} aria-label="Carrusel de tecnologías. Pasa el cursor o enfoca para pausar.">
        <Lane/><Lane reverse/>
      </div>
    </div>
  )
}
