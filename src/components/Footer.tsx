import { ArrowUpRight } from 'lucide-react'
import { Logo } from './Logo'
import type { SolutionOptionValue } from '../config/solutionOptions'
import { getAvailableContactChannels } from '../config/contact'

export function Footer({onContact}:{onContact:(solution?:SolutionOptionValue)=>void}){
  const channels = getAvailableContactChannels('Hola DITEON, me gustaría conversar sobre un proyecto de software.')

  return (
    <footer className="footer">
      <div className="shell footer__top">
        <div className="footer__brand">
          <Logo light/>
          <p>Ingeniería de software a medida, automatización de procesos y plataformas de control operativo.</p>
          <button className="footer-contact" onClick={() => onContact('otro')}>Iniciar conversación <ArrowUpRight size={16}/></button>
        </div>
        <div className="footer__cols footer__cols--four">
          <div>
            <b>Soluciones</b>
            <a href="#soluciones">CRM y ventas</a>
            <a href="#soluciones">POS e inventario</a>
            <a href="#soluciones">ERP y operaciones</a>
            <a href="#soluciones">Automatización de procesos</a>
          </div>
          <div>
            <b>Empresa</b>
            <a href="#producto">Producto</a>
            <a href="#ingenieria">Ingeniería</a>
            <a href="#metodologia">Metodología</a>
            <button onClick={() => onContact('otro')}>Contacto</button>
          </div>
          <div>
            <b>Contacto</b>
            {channels.length > 0 ? channels.map(channel => (
              <a key={channel.id} href={channel.href} target={channel.isExternal ? '_blank' : undefined} rel={channel.isExternal ? 'noreferrer' : undefined}>{channel.label}</a>
            )) : <button onClick={() => onContact('otro')}>Formulario de contacto</button>}
          </div>
          <div>
            <b>Legal</b>
            <a href="/privacidad.html">Privacidad</a>
            <a href="/terminos.html">Términos</a>
          </div>
        </div>
      </div>
      <div className="shell footer__bottom">
        <span>© 2026 DITEON. Todos los derechos reservados.</span>
        <div><span>Lima, Perú</span><a href="#inicio">Volver arriba ↑</a></div>
      </div>
    </footer>
  )
}
