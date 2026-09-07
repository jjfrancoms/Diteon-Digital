import { ArrowRight, ArrowDown, Check, ArrowUpRight } from 'lucide-react'
import type { ContactHandler } from '../config/experience'
import { trackEvent } from '../services/analytics'

export function Hero({ onContact }: { onContact: ContactHandler }) {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="shell hero__layout">
        <div className="hero__copy">
          <span className="eyebrow">
            <span className="brand-dot" /> Tecnología con un propósito
          </span>
          <h1 id="hero-title">
            Tu negocio avanza.
            <br />
            Tu tecnología
            <br />
            <em>también debería.</em>
          </h1>
          <p>
            Convertimos procesos dispersos en sistemas conectados. Software a
            medida para vender, operar y decidir con claridad.
          </p>
          <div className="button-row">
            <button
              className="button button--blue"
              onClick={() => {
                trackEvent('hero_contact_click')
                onContact()
              }}
            >
              Conversemos sobre tu idea <ArrowUpRight size={18} />
            </button>
            <a
              className="text-link"
              href="#producto"
              onClick={() => trackEvent('hero_cta_click')}
            >
              Explorar la demo <ArrowRight size={17} />
            </a>
          </div>
          <div className="hero__notes">
            <span>
              <Check size={15} /> A la medida de tu proceso
            </span>
            <span>
              <Check size={15} /> Desarrollo por fases
            </span>
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero__visual-label">
            <span>ASÍ SE VE UNA OPERACIÓN CONECTADA</span>
            <span>01 / 03</span>
          </div>
          <div className="hero-product">
            <div className="hero-product__top">
              <span className="mini-brand">
                D<span>·</span>
              </span>
              <b>Tu espacio de trabajo</b>
              <span className="demo-tag">Demo</span>
            </div>
            <div className="hero-product__heading">
              <div>
                <span className="micro-label">VISTA GENERAL</span>
                <h2>Todo tiene un siguiente paso.</h2>
              </div>
              <span className="avatar">DA</span>
            </div>
            <div className="hero-product__stats">
              <div>
                <span>Oportunidades</span>
                <strong>
                  12<small>en seguimiento</small>
                </strong>
              </div>
              <div>
                <span>Próximas acciones</span>
                <strong>
                  04<small>por completar</small>
                </strong>
              </div>
            </div>
            <div className="hero-pipeline">
              <div className="hero-pipeline__label">
                <b>Seguimiento comercial</b>
                <span>Vista de ejemplo</span>
              </div>
              {[
                ['NR', 'Nueva solicitud', 'Portal de clientes', 'Recibido'],
                [
                  'LM',
                  'Propuesta en preparación',
                  'Control de inventario',
                  'En curso',
                ],
                [
                  'AC',
                  'Reunión de alcance',
                  'Automatización de tareas',
                  'Agendada',
                ],
              ].map(([initials, title, subtitle, state], index) => (
                <div className="hero-pipeline__row" key={title}>
                  <span className={`avatar avatar--${index}`}>{initials}</span>
                  <div>
                    <b>{title}</b>
                    <small>{subtitle}</small>
                  </div>
                  <span className={`status status--${index}`}>{state}</span>
                </div>
              ))}
            </div>
            <a href="#producto" className="hero-product__footer">
              Recorre el proceso de una solicitud <ArrowRight size={16} />
            </a>
          </div>
          <div className="hero__signal">
            <span className="signal-icon">
              <Check size={17} />
            </span>
            <div>
              <b>Una solicitud. Un flujo claro.</b>
              <span>Contacto → responsable → próxima acción</span>
            </div>
          </div>
          <p className="demo-caption">
            Interfaz ilustrativa con datos de ejemplo.
          </p>
        </div>
      </div>
      <div className="shell hero__bottom">
        <span>Software a medida · Automatización · Integraciones</span>
        <a href="#soluciones">
          Encuentra tu punto de partida <ArrowDown size={16} />
        </a>
      </div>
    </section>
  )
}
