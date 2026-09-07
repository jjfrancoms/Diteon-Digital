import { motion, useReducedMotion } from 'framer-motion'

export function BackgroundPaths(){
  const reduced=useReducedMotion()
  const paths=Array.from({length:22},(_,i)=>{
    const y=50+i*17
    const bend=(i%2?1:-1)*(34+(i%5)*7)
    return `M -100 ${y+230} C 180 ${y+bend}, 400 ${420-y*.22}, 710 ${250+y*.08} S 1160 ${90+y*.34}, 1540 ${320-y*.08}`
  })
  return <svg className="background-paths" viewBox="0 0 1440 620" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="pathBlue" x1="0" x2="1"><stop stopColor="#1C6FE0" stopOpacity="0"/><stop offset=".45" stopColor="#1C6FE0"/><stop offset="1" stopColor="#7B61FF" stopOpacity="0"/></linearGradient><linearGradient id="pathCoral" x1="0" x2="1"><stop stopColor="#FF6B35" stopOpacity="0"/><stop offset=".55" stopColor="#FF6B35"/><stop offset="1" stopColor="#7B61FF" stopOpacity="0"/></linearGradient></defs>{paths.map((d,i)=><motion.path key={i} d={d} fill="none" stroke={i%4===0?'url(#pathCoral)':'url(#pathBlue)'} strokeOpacity={.12+(i%5)*.016} strokeWidth={i%6===0?1.25:.75} initial={reduced?false:{pathLength:0,opacity:0}} whileInView={{pathLength:1,opacity:1}} viewport={{once:true,amount:.18}} transition={{pathLength:{duration:1.25+i*.025,ease:[.16,1,.3,1]},opacity:{duration:.55}}}/>)}</svg>
}
